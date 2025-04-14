import { JsonSchema, JsonSchemaType } from "aws-cdk-lib/aws-apigateway";

const SignupSchema: JsonSchema = {
    type: JsonSchemaType.OBJECT,
    properties: {
      name: { type: JsonSchemaType.STRING, minLength: 3, maxLength: 150 },
      surname: { type: JsonSchemaType.STRING, minLength: 3, maxLength: 150 },
      email: { type: JsonSchemaType.STRING, format: "email" },
      password: { type: JsonSchemaType.STRING, minLength: 4 },
    },
    required: ["name", "surname", "email", "password"]
};
 
const LoginSchema: JsonSchema = {
    type: JsonSchemaType.OBJECT,
    properties: {
      email: { type: JsonSchemaType.STRING, format: "email" }, 
      password: { type: JsonSchemaType.STRING, minLength: 4 },
    },
    required: ["email", "password"]
  };

export { LoginSchema, SignupSchema };