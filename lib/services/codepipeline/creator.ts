import { IRepository, Repository } from "aws-cdk-lib/aws-codecommit";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import { CodeCommitSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from "constructs";

export class PipelineCreator {
    public static createPipeline(self: Construct, pipelineName: string): Pipeline  {
        const pipeline: Pipeline = new Pipeline(self, pipelineName, {
            pipelineName: pipelineName,
        });
        return pipeline;
    }
    public static addStageToPipeline() {

    }

    public static getCodeCommitRepository(self: Construct, repositoryName: string): IRepository {
        const repository: IRepository = Repository.fromRepositoryName(self, repositoryName, repositoryName);
        return repository;

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
        });
        return codeCommitSourceAction;
    }

    public static createArtifact(): Artifact {
        const artifact: Artifact = new Artifact();
        return artifact;
    }
}