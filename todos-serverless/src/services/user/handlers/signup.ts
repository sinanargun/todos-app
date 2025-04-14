import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { signToken } from "../../auth";
import { createUser, findUserByEmail } from "../repositories/user";
import { errorResponse, generateHash, successResponse } from "../../common/utils";
import { HTTP_STATUS } from "../../common/constants";

export async function signupHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        const requestBody = JSON.parse(event.body || "{}");
        const { name, surname, email, password } = requestBody;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return errorResponse(HTTP_STATUS.BAD_REQUEST, {
                message: "Email already exists.",
            });
        }

        const newUser = await createUser({
            id: crypto.randomUUID(),
            name,
            surname,
            email,
            password: generateHash(password),
        });

       const token = signToken({
            sub: newUser.id,
            email: newUser.email,
       });

        return successResponse(HTTP_STATUS.CREATED, {
            message: "User created successfully.",
            token,
        });
    } catch (error) {
        console.error("Error processing signup:", error);
        return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
            message: `An error occurred during signup. ${error}`,
        });
    }
}    