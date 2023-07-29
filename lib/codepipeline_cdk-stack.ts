import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineCreator } from './services/codepipeline/creator';
import { IAMCreator } from './services/iam/creator';
import { IRepository } from 'aws-cdk-lib/aws-codecommit';
import { CodeCommitSourceAction, ManualApprovalAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { SNSCreator } from './services/sns/creator';
import { fields } from './fields';
import { CloudwatchCreator } from './services/cloudwatch/creator';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CodepipelineCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //各アクションの定義
    //アーティファクトの作成
    const artifact = PipelineCreator.createArtifact();

    //CodeBuildのCloudwatchロググループを作成
    const codeBuildLogGroup: LogGroup = CloudwatchCreator.createLogGroup(this, "codeBuildLogGroup");

    //ソースアクション
    //CodeCommitリポジトリを取得
    const codeCommitRepository: IRepository = PipelineCreator.getCodeCommitRepository(this, "backend");

    const sourceAction: CodeCommitSourceAction = PipelineCreator.createCodeCommitSourceAction(
      "CodeCommit_Repository", 
      codeCommitRepository,
      "master",
      artifact,
    );

    //承認アクション
    const notificationTopic = SNSCreator.createSNSTopic(this, "notification-topic-by-email");
    SNSCreator.addEmailSubscription(notificationTopic, fields.notification_email);
    const manualApprovalAction: ManualApprovalAction = PipelineCreator.createManualApprovalAction("approval",notificationTopic);
    
    //デプロイステージ
    //CodeBuildプロジェクトで使用するIAMロールを作成
    const codeBuildRole = IAMCreator.createCodeBuildRole(this, "codebuild_backend_deploy_role");
    //CodeBuildプロジェクトの作成
    const codeBuildProject = PipelineCreator.createCodeBuildProject(
      this,
      "CodeBuildProject",
      "buildspec.yml",
      codeBuildRole
    );
    //CodeBuildアクションの追加
    const codeBuildAction = PipelineCreator.createCodeBuildAction(
      "CodeBuildAction",
      codeBuildProject,
      artifact,
    );

    //Pipeline作成
    const pipeline = PipelineCreator.createPipeline(this, "backend_pipeline");

    //Pipelineにステージを追加
    //CodeCommitリポジトリからコードを取得するステージ
    PipelineCreator.addStageToPipeline(pipeline, "CodeCommitStage", [sourceAction]);

    //承認ステージ
    PipelineCreator.addStageToPipeline(pipeline, "ApprovalStage", [manualApprovalAction]);

    //CodeBuildステージ
    PipelineCreator.addStageToPipeline(pipeline, "CodeBuildStage", [codeBuildAction]);
  }
}
