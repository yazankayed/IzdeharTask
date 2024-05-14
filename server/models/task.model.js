const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title Name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports.Task = mongoose.model("Task", TaskSchema);
