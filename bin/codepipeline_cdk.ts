#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CodepipelineCdkStack } from '../lib/codepipeline_cdk-stack';

const app = new cdk.App();
new CodepipelineCdkStack(app, 'CodepipelineCdkStack', {
  env: { region: "ap-northeast-1" },
});