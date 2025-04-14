
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { createTodo } from "../repositories/todo";
import { TODO_STATUS } from "../models/todo";
import { error } from "console";
import { errorResponse, successResponse } from "../../common/utils";
import { HTTP_STATUS } from "../../common/constants";

export async function createHandler(user_id: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const requestBody = JSON.parse(event.body || "{}");
        const { text, due_date  } = requestBody;

        if (due_date) {
            if(new Date(due_date) < new Date()) {
                return errorResponse(HTTP_STATUS.BAD_REQUEST, {
                    message: "Due date cannot be in the past.",
                });
            }
        }

        const createdTodo = await createTodo({
            id: crypto.randomUUID(),
            user_id,
            text,
            due_date: due_date ? due_date : null,
            status: TODO_STATUS.TODO,
        });
        
        return successResponse(HTTP_STATUS.CREATED, {
            message: "Todo created successfully.",
            todo: createdTodo,
        });
    } catch (error) {
        console.error("Error processing while creating todo:", error);
        return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
            message: `An error occurred during creating todo. ${error}`,
        });
    }
}