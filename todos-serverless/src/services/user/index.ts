import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { signupHandler } from "./handlers/signup";
import { loginHandler } from "./handlers/login";
import { errorResponse } from "../common/utils";
import { HTTP_STATUS } from "../common/constants";

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    try {
        switch (event.path) {
            case "/users/signup":
                return await signupHandler(event, context);
            case "/users/login":
                return await loginHandler(event, context);
            case "/users/logout":
                // Handle user logout
                // break;
            default:
                return errorResponse(HTTP_STATUS.BAD_REQUEST, {
                    message: 'Invalid path: ' + event.path
                });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
            message: `Internal Server Error: ${error}`,
        });
    }
};    