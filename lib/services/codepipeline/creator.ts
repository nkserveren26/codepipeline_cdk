import { Pipeline } from "aws-cdk-lib/aws-codepipeline";
import { Construct } from "constructs";

export class PipelineCreator {
    public static createPipeline(self: Construct,pipelineName: string): Pipeline  {
        const pipeline: Pipeline = new Pipeline(self, pipelineName, {
            pipelineName: pipelineName,
        });
        return pipeline;
    }
    public static addStageToPipeline() {

    }
}