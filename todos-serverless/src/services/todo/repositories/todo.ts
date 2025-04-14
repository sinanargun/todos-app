import Database from "../../common/db";
import { TodoModel, TODO_STATUS } from "../models/todo";

export async function createTodo(todo:TodoModel): Promise<TodoModel> {
    const dbInstance = Database.getInstance();

    const query = `INSERT INTO todos (id, user_id, text, status, due_date, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
        RETURNING *`;

    const values = [todo.id, todo.user_id, todo.text, todo.status, todo.due_date];
    
    try {
        const result = await dbInstance.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating todo:", error);
        throw new Error("Database error");
    }
}

export async function getTodos(user_id: string, status: TODO_STATUS, limit: number, offset: number): Promise<TodoModel[]> {
    const dbInstance = Database.getInstance();

    const query = `SELECT * FROM todos WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC limit $3 offset $4`;
    const values = [user_id, status, limit, offset];

    console.log("Query:", query);
    console.log("Values:", values);
    
    try {
        const result = await dbInstance.query(query, values);
        return result.rows;
    } catch (error) {
        console.error("Error fetching todos:", error);
        throw new Error("Database error");
    }
}

export async function updateTodo(todo_id: string, user_id: string, updatedFields: Partial<TodoModel>): Promise<TodoModel> {
    const dbInstance = Database.getInstance();

    const setClause = Object.keys(updatedFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
    const values = [...Object.values(updatedFields)];

    const query = `UPDATE todos SET ${setClause}, updated_at = NOW() WHERE id = '${todo_id}' AND user_id = '${user_id}' RETURNING *`;

    try {
        const result = await dbInstance.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating todo:", error);
        throw new Error("Database error");
    }
}

export async function deleteTodo(todo_id: string, user_id: string): Promise<void> {
    const dbInstance = Database.getInstance();

    const query = `UPDATE todos SET status = '${TODO_STATUS.DELETED}', deleted_at = NOW() WHERE id = $1 AND user_id = $2`;
    const values = [todo_id, user_id];
    
    try {
        await dbInstance.query(query, values);
    } catch (error) {
        console.error("Error deleting todo:", error);
        throw new Error("Database error");
    }
}
  