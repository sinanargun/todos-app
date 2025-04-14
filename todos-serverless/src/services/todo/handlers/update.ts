
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { updateTodo } from "../repositories/todo";
import { TODO_STATUS, TodoModel } from "../models/todo";
import { errorResponse, successResponse } from "../../common/utils";
import { HTTP_STATUS } from "../../common/constants";

export async function updateHandler(user_id: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
   try {
        const todo_id = event.pathParameters?.todoId;
        if (!todo_id) {
            return errorResponse(HTTP_STATUS.BAD_REQUEST, {
                message: "Todo ID is required.",
            });
        }
        const requestBody = JSON.parse(event.body || "{}");
        const { text, due_date, status  } = requestBody;

        if (due_date) {
            if(new Date(due_date) < new Date()) {
                return errorResponse(HTTP_STATUS.BAD_REQUEST, {
                    message: "Due date cannot be in the past.",
                });
            }
        }

        const updatedFields: Partial<TodoModel> = {};
        if (text) {
            updatedFields.text = text;
        }
        if (due_date) {
            updatedFields.due_date = due_date;
        }
        if (status) {
            updatedFields.status = status;
        }

        const updatedTodo = await updateTodo(todo_id, user_id, updatedFields);
        
        return successResponse(HTTP_STATUS.OK, {
            message: "Todo updated successfully.",
            todo_id: updatedTodo.id,
        });
    } catch (error) {
         console.error("Error processing while updating todo:", error);
         return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
             message: `An error occurred during updating todo. ${error}`,
         });
    }
}