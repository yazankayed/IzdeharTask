const UserController = require("../controllers/user.controller");
const { authenticate, checkActivity } = require("../config/jwt.config");
const TaskController = require("../controllers/task.controller");

module.exports = (app) => {
  app.post("/api/register", UserController.register);
  app.post("/api/login", UserController.login);
  app.get("/api/logout", UserController.logout);
  app.get("/api/loggedin", authenticate, checkActivity, UserController.getLoggedInUser);
  app.post("/api/forgot-password", UserController.forgotPassword);
  app.post("/api/verify-code", UserController.verifyCode);
  app.post("/api/reset-password", UserController.resetPassword);
  app.get("/api", TaskController.index);
  app.post("/api/tasks", TaskController.createTask);
  app.get("/api/tasks", TaskController.getAllTasks);
  app.get("/api/tasks/:id", TaskController.getTask);
  app.patch("/api/tasks/:id", TaskController.updateTask);
  app.delete("/api/tasks/:id", TaskController.deleteTask);
  app.put("/api/tasks/:id", TaskController.updateTask);
};
