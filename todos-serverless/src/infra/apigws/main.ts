import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { AuthorizationType, Cors, LambdaIntegration, Method, MethodOptions, Model, RequestValidator, ResourceOptions, RestApi, TokenAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { createTodoSchema, updateTodoSchema, SignupSchema, LoginSchema } from "./schemas";

interface MainApiGatewayStackProps extends StackProps {
    userLambdaIntegration: LambdaIntegration; 
    todoLambdaIntegration: LambdaIntegration;
}

export class MainApiGatewayStack extends Stack {
    constructor(scope: Construct, id: string, props: MainApiGatewayStackProps) {
        super(scope, id, props);

        // Define the API Gateway
        const api = new RestApi(this, "MainApiGateway", {
            restApiName: "Main API Gateway",
            description: "API Gateway for the services",
        });

        const authLambdaFunction = new NodejsFunction(this, "MainApiGatewayAuthLambdaFunction", {
            entry: join(__dirname, "../..", "services", "auth", "index.ts"),
            handler: "handler",
            runtime: Runtime.NODEJS_22_X,
            environment: {
                // Add any environment variables here
            },
        });
        
        const authorizer = new TokenAuthorizer(this, "MainApiGatewayAuthorizer", {
            handler: authLambdaFunction,
            identitySource: "method.request.header.Authorization",
           // resultsCacheTtl: Duration.seconds(0),
        });

        const authMethodOptions: MethodOptions = {
            authorizationType: AuthorizationType.CUSTOM,
            authorizer: authorizer,
        };

        const corsOptions: ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
            },
        }

        const userResource = api.root.addResource("users", corsOptions);
        
        const signupResource = userResource.addResource("signup", corsOptions);
        signupResource.addMethod("POST", props.userLambdaIntegration, {
            requestValidator: new RequestValidator(this, "SignupRequestValidator", {
                restApi: api,
                requestValidatorName: "SignupRequestValidator",
                validateRequestBody: true,
                validateRequestParameters: false,
            }),
            requestModels: {
                "application/json": new Model(this, "SignupRequestModel", {
                    restApi: api,
                    modelName: "SignupRequestModel",
                    contentType: "application/json",
                    schema: SignupSchema,
                }),
            }, 
        });
        
        const loginResource = userResource.addResource("login", corsOptions);
        loginResource.addMethod("POST", props.userLambdaIntegration, {
            requestValidator: new RequestValidator(this, "LoginRequestValidator", {
                restApi: api,
                requestValidatorName: "LoginRequestValidator",
                validateRequestBody: true,
                validateRequestParameters: false,
            }),
            requestModels: {
                "application/json": new Model(this, "LoginRequestModel", {
                    restApi: api,
                    modelName: "LoginRequestModel",
                    contentType: "application/json",
                    schema: LoginSchema,
                }),
            },
        });
        
        const logoutResource = userResource.addResource("logout", corsOptions);
        logoutResource.addMethod("POST", props.userLambdaIntegration, authMethodOptions);
        
        const todoResource = api.root.addResource("todos", corsOptions);

        todoResource.addMethod("POST", props.todoLambdaIntegration, { 
            ...authMethodOptions, 
            requestValidator: new RequestValidator(this, "CreateTodoRequestValidator", {
                restApi: api,
                requestValidatorName: "CreateTodoRequestValidator",
                validateRequestBody: true,
                validateRequestParameters: false,
            }),
            requestModels: {
                "application/json": new Model(this, "CreateTodoRequestModel", {
                    restApi: api,
                    modelName: "CreateTodoRequestModel",
                    contentType: "application/json",
                    schema: createTodoSchema,
                }),
            },
        });

        todoResource.addMethod("GET", props.todoLambdaIntegration, { 
            ...authMethodOptions, 
            requestValidatorOptions: { validateRequestParameters: true, validateRequestBody: false },
            requestParameters: {
                "method.request.querystring.limit": true,
                "method.request.querystring.offset": true,
            },
        });

        const todo_idResource = todoResource.addResource("{todoId}", corsOptions);

        todo_idResource.addMethod("PUT", props.todoLambdaIntegration, {
            ...authMethodOptions, 
            requestValidator: new RequestValidator(this, "UpdateTodoRequestValidator", {
                restApi: api,
                requestValidatorName: "UpdateTodoRequestValidator",
                validateRequestBody: true,
                validateRequestParameters: true,
            }),
            requestModels: {
                "application/json": new Model(this, "UpdateTodoRequestModels", {
                    restApi: api,
                    modelName: "UpdateTodoRequestModels",
                    contentType: "application/json",
                    schema: updateTodoSchema,
                }),
            },
        });

        todo_idResource.addMethod("DELETE", props.todoLambdaIntegration, {
            ...authMethodOptions,
        });
    }
}