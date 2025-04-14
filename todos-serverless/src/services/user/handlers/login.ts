import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { signToken } from "../../auth";
import { findUserByEmail } from "../repositories/user";
import { compareHash, errorResponse, successResponse } from "../../common/utils";
import { error } from "console";
import { HTTP_STATUS } from "../../common/constants";

export async function loginHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        const requestBody = JSON.parse(event.body || "{}");
        const { email, password } = requestBody;

        const user = await findUserByEmail(email);
        if (!user) {
            return errorResponse(HTTP_STATUS.UNAUTHORIZED, {
                message: "Invalid email.",
            });
        }

        if (!compareHash(password, user.password)) {
            return errorResponse(HTTP_STATUS.UNAUTHORIZED, {
                message: "Invalid password.",
            });
        }

        const token = signToken({
            sub: user.id,
            email,
        });

        return successResponse(HTTP_STATUS.OK, {
            message: "Login successful.",
            token,
        });
    } catch (error) {
        console.error("Error processing login:", error);
        return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
            message: `An error occurred during login. ${error}`,
        });
    }
}