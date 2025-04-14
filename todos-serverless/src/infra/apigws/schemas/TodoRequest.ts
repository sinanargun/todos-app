import { JsonSchema, JsonSchemaType } from "aws-cdk-lib/aws-apigateway";

const createTodoSchema: JsonSchema = {
    type: JsonSchemaType.OBJECT,
    properties: {
        text: { type: JsonSchemaType.STRING, minLength: 1, maxLength: 200 },
        due_date: { type: JsonSchemaType.STRING, format: "date-time" },
    },
    required: ["text"],
};

const updateTodoSchema: JsonSchema = {
    type: JsonSchemaType.OBJECT,
    properties: {
        text: { type: JsonSchemaType.STRING, minLength: 1, maxLength: 200 },
        status: { type: JsonSchemaType.STRING, enum: ["TODO", "DONE"] },
        due_date: { type: JsonSchemaType.STRING, format: "date-time" },
    },
    anyOf: [
        { required: ["text"] },
        { required: ["status"] },
        { required: ["due_date"] },
    ],
};

export {
    createTodoSchema,
    updateTodoSchema,
};