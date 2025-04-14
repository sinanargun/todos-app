import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./css/Signup.css";
import { signup } from "../api/user";

const Signup = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    surname: Yup.string().required("Surname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
  });

  const handleSignup = (values) => {
     signup(values.name, values.surname, values.email, values.password).then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        alert("Error signing up. Please try again.");
      });
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <Formik
        initialValues={{ name: "", surname: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        {({ isSubmitting }) => (
          <Form className="signup-box">
            <Field type="text" name="name" placeholder="Name" className="input-field" />
            <ErrorMessage name="name" component="div" className="error-message" />

            <Field type="text" name="surname" placeholder="Surname" className="input-field" />
            <ErrorMessage name="surname" component="div" className="error-message" />

            <Field type="email" name="email" placeholder="Email" className="input-field" />
            <ErrorMessage name="email" component="div" className="error-message" />

            <Field type="password" name="password" placeholder="Password" className="input-field" />
            <ErrorMessage name="password" component="div" className="error-message" />

            <button type="submit" disabled={isSubmitting} className="submit-button">Sign Up</button>
          </Form>
        )}
      </Formik>
      <p>Already have an account? <span onClick={() => navigate("/")} className="login-link">Login here</span></p>
    </div>
  );
};

export default Signup;
