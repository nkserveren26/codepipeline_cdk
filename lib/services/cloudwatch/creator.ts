import { RemovalPolicy } from "aws-cdk-lib";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class CloudwatchCreator {
    public static createLogGroup(self: Construct, logGroupName: string): LogGroup {
        const logGroup: LogGroup = new LogGroup(self, logGroupName, {
            retention: RetentionDays.ONE_WEEK,
            removalPolicy: RemovalPolicy.DESTROY,
        });
        return logGroup;
    }
}