import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../style/VerifyCode.css";
import logo from "../static/code.png"; // Path to the uploaded photo

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/verify-code",
        { email, code }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        navigate(`/reset-password/${email}/${code}`);
      }
    } catch (err) {
      setMessage("An error occurred");
    }
  };

  return (
    <div className="verify-code-container">
      <div className="verify-code-form">
        <h2>Checking the code</h2>
        <h4>Sent code:</h4>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            
            <div className="input-group">

              <input id={`code-input`} type="text" maxLength="1"/>
              <input id={`code-input`} type="text" maxLength="1"/>
              <input id={`code-input`} type="text" maxLength="1"/>
              <input id={`code-input`} type="text" maxLength="1"/>
              <input id={`code-input`} type="text" maxLength="1"/>
              <input id={`code-input`} type="text" maxLength="1"/>
            </div>
            
           
          </div>
          <button type="submit">Continue</button>
        </form>
      </div>
      <div className="verify-code-right">
        <div className="verify-code-logo">
          <img src={logo} alt="Logo" />
        </div>
        <p>التحقق من الرمز!</p>
        <p>
          لقد تم ارسال رمز على بريدك الالكتروني الرجاء كتابته في الحقول المخصصة لبدء استرجاع كلمة المرور
          
        </p>
      </div>
      
    </div>
  );
};

export default VerifyCode;
