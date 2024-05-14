import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../style/Login.css";
import logo from "../static/login.png"; // Path to the uploaded photo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg || "An error occurred");
      } else {
        setError("An error occurred");
      }
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>
        <p>مرحباً بك في موقع مهمتك</p>
        <p>مهمتك هو عبارة عن موقع الكتروني يساعدك في انجاز مهامك بسهولة</p>
      </div>
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot your password?
        </Link>
        <button onClick={handleRegister} className="register-button">
          New here? Click here to register
        </button>
      </div>
    </div>
  );
};

export default Login;
