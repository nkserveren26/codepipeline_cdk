import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineCreator } from './services/codepipeline/creator';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CodepipelineCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //各ステージの定義
    //Pipeline作成
    const pipeline = PipelineCreator.createPipeline(scope, "backend_pipeline");
    //Pipelineにステージを追加
  }
}
