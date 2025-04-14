
export const enum TODO_STATUS {
    TODO = "TODO",
    DONE = "DONE",
    DELETED = "DELETED",
}

export interface TodoModel {
    id: string,
    user_id: string,
    text: string,
    status: TODO_STATUS,
    due_date?: Date,
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date,
}

