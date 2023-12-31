import { BuildSpec, LinuxBuildImage, PipelineProject } from "aws-cdk-lib/aws-codebuild";
import { IRepository, Repository } from "aws-cdk-lib/aws-codecommit";
import { Artifact, IAction, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import { CodeBuildAction, CodeCommitSourceAction, ManualApprovalAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Role } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

export class PipelineCreator {
    public static createPipeline(self: Construct, pipelineName: string): Pipeline  {
        const pipeline: Pipeline = new Pipeline(self, pipelineName, {
            pipelineName: pipelineName,
        });
        return pipeline;
    }
    public static addStageToPipeline(
        pipeline: Pipeline, 
        stageName: string, 
        actions: IAction[]): void {
        pipeline.addStage({
            stageName: stageName,
            actions: actions,
        });
    }

    public static getCodeCommitRepository(self: Construct, repositoryName: string): IRepository {
        const repository: IRepository = Repository.fromRepositoryName(self, repositoryName, repositoryName);
        return repository;

    }

    public static createCodeBuildProject(
        self: Construct, 
        projectName: string, 
        buildSpecPath: string,
        projectRole: Role,
        logGroup?: LogGroup): PipelineProject {
        const codeBuildProject: PipelineProject = new PipelineProject(
            self,
            projectName,
            {
                projectName: projectName,
                buildSpec: BuildSpec.fromSourceFilename(buildSpecPath),
                role: projectRole,
                environment: {
                    buildImage: LinuxBuildImage.STANDARD_6_0,
                },
                logging: {
                    cloudWatch: { enabled: true, logGroup },
                },
            }
        );
        return codeBuildProject;
    }

    public static createCodeCommitSourceAction(
        actionName: string, 
        repo: IRepository, 
        branch: string, 
        sourceOutput: Artifact): CodeCommitSourceAction {
        const codeCommitSourceAction: CodeCommitSourceAction = new CodeCommitSourceAction({
            actionName: actionName,
            repository: repo,
            branch: branch,
            output: sourceOutput,
            runOrder: 1,
        });
        return codeCommitSourceAction;
    }

    public static createManualApprovalAction(actionName: string,notificationTopic: Topic): ManualApprovalAction {
        const manualApprovalAction = new ManualApprovalAction({
            actionName: actionName,
            notificationTopic: notificationTopic,
            runOrder: 2,
        });
        return manualApprovalAction;
    }

    public static createCodeBuildAction(
        actionName: string, 
        codeBuildProject: PipelineProject, 
        artifact: Artifact): CodeBuildAction {
        const codeBuildAction = new CodeBuildAction({
            actionName: actionName,
            project: codeBuildProject,
            input: artifact,
            runOrder: 3,
        });
        return codeBuildAction;
    }

    public static createArtifact(): Artifact {
        const artifact: Artifact = new Artifact();
        return artifact;
    }
}