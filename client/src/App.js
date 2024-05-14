import React from "react";
import { Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import VerifyCode from "./components/VerifyCode";
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code/:email" element={<VerifyCode />} />
        <Route
          path="/reset-password/:email/:code"
          element={<ResetPassword />}
        />
        <Route path="/home" element={<TaskList />} />
      </Routes>
    </div>
  );
}

export default App;
