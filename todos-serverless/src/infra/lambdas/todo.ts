import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export class TodoLambdaStack extends Stack {
    public readonly todoLambdaIntegration: LambdaIntegration;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const SSM_PREFIX = "/todos_app";
        const todoLambdaFunction = new NodejsFunction(this, "TodoLambdaFunction", {
            entry: join(__dirname, "../..", "services", "todo", "index.ts"),
            handler: "handler",
            runtime: Runtime.NODEJS_22_X,
            environment: {
                DB_HOST: StringParameter.valueForStringParameter(this, `${SSM_PREFIX}/DB_HOST`),
                DB_NAME: StringParameter.valueForStringParameter(this, `${SSM_PREFIX}/DB_NAME`),
                DB_USER: StringParameter.valueForStringParameter(this, `${SSM_PREFIX}/DB_USER`),
                DB_PASSWORD: StringParameter.valueForStringParameter(this, `${SSM_PREFIX}/DB_PASSWORD`),
                DB_PORT: StringParameter.valueForStringParameter(this, `${SSM_PREFIX}/DB_PORT`),
                DB_CA: StringParameter.valueForStringParameter(this, `${SSM_PREFIX}/DB_CA`),
            },
        });

        // Set up the API Gateway integration
        this.todoLambdaIntegration = new LambdaIntegration(todoLambdaFunction);
    }
}