import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { createHandler } from "./handlers/create";
import { getHandler } from "./handlers/get";
import { updateHandler } from "./handlers/update";
import { deleteHandler } from "./handlers/delete";
import { HTTP_METHODS, HTTP_STATUS } from "../common/constants";
import { errorResponse } from "../common/utils";

interface ExtendedContext extends Context {
    user_id: string;
}

export async function handler(event: APIGatewayProxyEvent, context: ExtendedContext): Promise<APIGatewayProxyResult> {
    try {
        const httpMethod = event.httpMethod;
        const user_id = event.requestContext?.authorizer?.user_id;;

        if (!user_id) {
            return errorResponse(HTTP_STATUS.UNAUTHORIZED, {
                message: "Unauthorized: No user ID found in context.",
            });
        }

        switch (httpMethod) {
            case HTTP_METHODS.POST:
                return await createHandler(user_id, event);
            case HTTP_METHODS.GET:
                return await getHandler(user_id, event);
            case HTTP_METHODS.PUT:
                return await updateHandler(user_id, event);
            case HTTP_METHODS.DELETE:
                return await deleteHandler(user_id, event);
            default:
                return errorResponse(HTTP_STATUS.BAD_REQUEST, {
                    message: 'Invalid http method: ' + httpMethod
                });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
            message: `Internal Server Error: ${error}`,
        });
    }
};    

