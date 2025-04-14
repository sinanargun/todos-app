import { APIGatewayAuthorizerResult, Context, APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "./models/jwt";

const SECRET_KEY = "1234567890"; // Replace with your actual secret key

export async function handler(event: APIGatewayTokenAuthorizerEvent, context: Context): Promise<APIGatewayAuthorizerResult> {
    const token = event.authorizationToken?.replace("Bearer ", "");

    if (!token) {
        return generatePolicy("user", "Deny", event.methodArn);
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return generatePolicy("user", "Deny", event.methodArn);
        }
        return generatePolicy(decoded.sub, "Allow", event.methodArn);
    } catch (error) {
        return generatePolicy("user", "Deny", event.methodArn);
    }
}

function generatePolicy(principalId: string, effect: "Allow" | "Deny", resource: string): APIGatewayAuthorizerResult {
    return {
        principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: `${resource.split('/')[0]}/*`
                },
            ],
        },
       ...(effect === "Allow" ? { context: { user_id: principalId } } : null),
    };
}


export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Token expires in 1 hour
}

function verifyToken(token: string): JwtPayload | null {
    try {   
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

export function decodeToken(token: string): JwtPayload | null {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
}
