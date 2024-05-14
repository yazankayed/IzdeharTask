import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Register.css";
import logo from "../static/signup.png"; // Path to the uploaded photo

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      setMessage(response.data.message);
      if (response.data.msg === "Registered successfully!") {
        navigate("/home");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.message || "An error occurred");
      } else {
        setMessage("An error occurred");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>إنشاء حساب</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
      <div className="register-right">
        <div className="register-logo">
          <img src={logo} alt="Logo" />
        </div>
        <p>هيا لنبدأ رحلتك سويا</p>
        <p>قم بإنشاء حساب مجاني، تماما في موقع مهمتك، ودعنا نرتب مهامك سويا</p>
      </div>
    </div>
  );
};

export default Register;
