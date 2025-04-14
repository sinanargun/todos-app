
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getTodos } from "../repositories/todo";
import { TODO_STATUS } from "../models/todo";
import { errorResponse, successResponse } from "../../common/utils";
import { HTTP_STATUS } from "../../common/constants";

export async function getHandler(user_id: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const status = event.queryStringParameters?.status || TODO_STATUS.TODO;
        const limit = parseInt(event.queryStringParameters?.limit || "10");
        const offset = parseInt(event.queryStringParameters?.offset || "0");

        const todos = await getTodos(user_id, status as TODO_STATUS, limit, offset);
        
        return successResponse(HTTP_STATUS.OK, {
            message: "Todos retrieved successfully.",
            todos,
        });
        
    } catch (error) {
        console.error("Error processing while getting todos:", error);
        return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
            message: `An error occurred during getting todos. ${error}`,
        });  
    }
}