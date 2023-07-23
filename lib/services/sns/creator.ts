import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

export class SNSCreator {
    public static createSNSTopic(self: Construct, topicName: string): Topic {
        const topic: Topic = new Topic(self, topicName, {
            topicName: topicName,
        });
        return topic;
    }
}