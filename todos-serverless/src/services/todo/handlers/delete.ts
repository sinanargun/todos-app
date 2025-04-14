
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { deleteTodo } from "../repositories/todo";
import { errorResponse, successResponse } from "../../common/utils";
import { HTTP_STATUS } from "../../common/constants";

export async function deleteHandler(user_id: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
   try {
        const todo_id = event.pathParameters?.todoId;
        if (!todo_id) {
            return errorResponse(HTTP_STATUS.BAD_REQUEST, {
                message: "Todo ID is required.",
            });
        }

        await deleteTodo(todo_id, user_id);

        return successResponse(HTTP_STATUS.OK, {
            message: "Todo deleted successfully.",
            todo_id,
        });
    } catch (error) {
         console.error("Error processing while deleting todo:", error);
         return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
             message: `An error occurred during deleting todo. ${error}`,
         });
    }
}