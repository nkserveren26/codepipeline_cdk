import { IRepository, Repository } from "aws-cdk-lib/aws-codecommit";
import { Pipeline } from "aws-cdk-lib/aws-codepipeline";
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
        const repository = Repository.fromRepositoryName(self, repositoryName, repositoryName);
        return repository;

    }
}