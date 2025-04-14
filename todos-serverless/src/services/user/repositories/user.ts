import Database from "../../common/db";
import { UserModel } from "../models/user";

export async function createUser(user:UserModel): Promise<UserModel> {
  const dbInstance = Database.getInstance();

  const query = `INSERT INTO users (id, name, surname, password, email, created_at, updated_at) 
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
    RETURNING *`;

  const values = [user.id, user.name, user.surname, user.password, user.email];

  try {
    const result = await dbInstance.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Database error");
  }
  }

  export async function findUserByEmail(email: string): Promise<UserModel | null> {
    const dbInstance = Database.getInstance();
  
    const query = `
      SELECT * FROM users WHERE email = $1
    `;
  
    const values = [email];
  
    try {
      const result = await dbInstance.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Database error");
    }
  }

 export async function findUserById(id: string): Promise<UserModel | null> {
    const dbInstance = Database.getInstance();
  
    const query = `
      SELECT * FROM users WHERE id = $1
    `;
  
    const values = [id];
  
    try {
      const result = await dbInstance.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Database error");
    }
}

