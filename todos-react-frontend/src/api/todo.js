import axios from "axios";
import config from "../config";
import { GET_TODO_LIST } from "../constant";
import { convertDateToISO } from "../common/utils";

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json"
  },
});

export const getTodos = () => api.get("/todos", {
  params: {
    limit: GET_TODO_LIST.LIMIT,
    offset: GET_TODO_LIST.OFFSET,
  },
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }
});

export const addTodo = (text, due_date) => {
  const payload = { text };
  if (due_date) {
    payload.due_date = convertDateToISO(due_date);
  } 
  return api.post("/todos", payload, { headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }}).catch(() => {
    alert("Failed to add todo. Please try again.");
  });
};

export const updateTodoStatus = (id, text, due_date, status) => {
  const payload = {};
  if (text) payload.text = text;
  if (due_date) payload.due_date = convertDateToISO(due_date);
  if (status) payload.status = status;  
  return api.put(`/todos/${id}`, payload, { headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }}).catch(() => {
    alert("Failed to update todo. Please try again.");
  });
}

export default api;
