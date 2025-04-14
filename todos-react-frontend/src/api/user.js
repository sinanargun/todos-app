import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = (email, password) => api.post("/users/login", { email, password })

export const signup = (name, surname, email, password) => api.post("/users/signup", { name, surname,email, password});