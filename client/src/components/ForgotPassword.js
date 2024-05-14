import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/ForgotPassword.css";
import logo from "../static/forgetpassword1.png"; // Path to the uploaded photo

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        navigate(`/verify-code/${email}`);
      }
    } catch (err) {
      setMessage("An error occurred");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        {message && <p className="message">{message}</p>}
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
          <button type="submit">متابعة</button>
        </form>
      </div>
      <div className="forgot-password-right">
        <div className="forgot-password-logo">
          <img src={logo} alt="Logo" />
        </div>
        <p>هل نسيت كلمة المرور؟</p>
        <p>
          لا تقلق هذا يحدث أحياناً، الرجاء ادخال بريدك الإلكتروني في الحقل المخصص،
          وعند تأكيده سيتم إرسال رمز إعادة تعيين كلمة المرور على بريدك الإلكتروني
        </p>
        <p></p>
        <p></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
