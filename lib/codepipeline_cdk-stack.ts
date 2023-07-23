import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineCreator } from './services/codepipeline/creator';
import { IAMCreator } from './services/iam/creator';
import { IRepository } from 'aws-cdk-lib/aws-codecommit';
import { CodeCommitSourceAction, ManualApprovalAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { SNSCreator } from './services/sns/creator';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CodepipelineCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //各アクションの定義
    //アーティファクトの作成
    const artifact = PipelineCreator.createArtifact();

    //ソースアクション
    //CodeCommitリポジトリを取得
    const codeCommitRepository: IRepository = PipelineCreator.getCodeCommitRepository(scope, "backend");

    const sourceAction: CodeCommitSourceAction = PipelineCreator.createCodeCommitSourceAction(
      "CodeCommit_Repository", 
      codeCommitRepository,
      "master",
      artifact,
    );

    //承認アクション
    const manualApprovalAction: ManualApprovalAction = PipelineCreator.createManualApprovalAction("approval");
    const notificationTopic = SNSCreator.createSNSTopic(scope, "notification-topic-by-email");

    //デプロイステージ

    //CodeBuildプロジェクトで使用するIAMロールを作成
    const codeBuildRole = IAMCreator.createCodeBuildRole(scope, "codebuild_backend_deploy_role");
    //Pipeline作成
    const pipeline = PipelineCreator.createPipeline(scope, "backend_pipeline");
    //Pipelineにステージを追加
  }
}
