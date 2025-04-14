import { App } from "aws-cdk-lib";
import { UserLambdaStack, TodoLambdaStack } from "./lambdas";
import { MainApiGatewayStack } from "./apigws";

const app = new App();

const userLambdaStack = new UserLambdaStack(app, 'UserLambdaStack');

const todoLambdaStack = new TodoLambdaStack(app, 'TodoLambdaStack');

const mainApiGatewayStack = new MainApiGatewayStack(app, 'MainApiGatewayStack', {
  userLambdaIntegration: userLambdaStack.userLambdaIntegration,
  todoLambdaIntegration: todoLambdaStack.todoLambdaIntegration,
});