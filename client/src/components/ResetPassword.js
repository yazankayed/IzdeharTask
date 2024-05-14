import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../style/ResetPassword.css";
import logo from "../static/new.png"; // Path to the uploaded photo

const ResetPassword = () => {
  const { email, code } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/reset-password`,
        { email, code, password }
      );
      setMessage(response.data.message);
    } catch (err) {
      setMessage("An error occurred");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-left">
        <div className="reset-password-logo">
          <img src={logo} alt="Logo" />
        </div>
        <p>انت تبلي حسناً</p>
        <p>
          يمكنك الان إعادة تعيين كلمة المرور وادخال كلمة مرور جديدة والبدء في إنجاز مهامك...
        </p>
      </div>
      <div className="reset-password-form">
        <h2>تعيين كلمة المرور الجديدة</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>كلمة المرور:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">إعادة تعيين كلمة المرور</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
