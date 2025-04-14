export interface UserModel {
    id: string;      
    name: string;      
    surname: string;   
    password: string;  
    email: string; 
    created_at?: Date;  
    updated_at?: Date; 
  }