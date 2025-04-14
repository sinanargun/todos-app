import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import { login } from "../api/user";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    login(email, password)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Invalid email or password. Please try again.");
        } else {
          alert("An error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="login-container">
      <h1>Welcome to Todo App</h1>
      <div className="login-box">
        <p>Don't have an account? <span onClick={() => navigate("/signup")} className="register-link">Create an account</span></p>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
