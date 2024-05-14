import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/TaskList.css";
import profilePic from "../static/profile_pic.jpg";
import deletePic from "../static/delete.png";
import tickIcon from "../static/tick.png";
import logo from "../static/logo.svg"; // Assuming you have a logo image

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(5); // Number of rows per page
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/tasks/${id}`,
        { status: newStatus }
      );
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, status: response.data.status } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleAddTask = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
    setNewTask({ title: "", description: "" });
  };

  const handleSaveTask = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/tasks",
        newTask
      );
      setTasks([...tasks, response.data]);
      handleCloseAddPopup();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeletePopup(true);
  };

  const handleConfirmDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${taskToDelete._id}`);
      setTasks(tasks.filter((task) => task._id !== taskToDelete._id));
      setShowDeletePopup(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setTaskToDelete(null);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setNewTask({ title: task.title, description: task.description });
    setShowEditPopup(true);
  };

  const handleSaveEditTask = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/tasks/${taskToEdit._id}`,
        newTask
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskToEdit._id ? { ...response.data } : task
        )
      );
      setShowEditPopup(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setTaskToEdit(null);
    setNewTask({ title: "", description: "" });
  };

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChangeRowsPerPage = (e) => {
    setTasksPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const filteredTasks = sortedTasks
    .filter((task) => {
      if (filter === "All") return true;
      return task.status === filter;
    })
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handleProfileClick = () => {
    setShowLogoutButton(!showLogoutButton);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/logout");
      console.log("Logout successful", response);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="task-list">
      <nav className="navbar">
        <div className="profile-pic" onClick={handleProfileClick}>
          <img src={profilePic} alt="Profile" />
          {showLogoutButton && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
        <div>
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </nav>

      {tasks.length > 0 && (
        <header>
          <div className="header-content">
            <button className="add-task-button" onClick={handleAddTask}>
              + Add Task
            </button>
            <select
              className="filter-tasks"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="All">All Tasks</option>
              <option value="Completed">Completed Tasks</option>
              <option value="Pending">Pending Tasks</option>
            </select>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </header>
      )}

      {tasks.length === 0 ? (
        <div className="no-tasks">
          <p>You don't have any tasks yet, let's add something new!</p>
          <button className="add-task-button-large" onClick={handleAddTask}>
            + Add Task
          </button>
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("id")}
                  style={{ cursor: "pointer" }}
                >
                  #
                </th>
                <th
                  onClick={() => handleSort("title")}
                  style={{ cursor: "pointer" }}
                >
                  Title
                </th>
                <th>Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr
                  key={task._id}
                  className={
                    task.status === "Completed" ? "completed-task" : ""
                  }
                >
                  <td>
                    {task.status === "Completed" && (
                      <img
                        src={tickIcon}
                        alt="Tick Icon"
                        className="tick-icon"
                      />
                    )}
                    {task._id}
                  </td>
                  <td>{task.title}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className={
                        task.status === "Completed"
                          ? "status-completed"
                          : "status-pending"
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>{task.description}</td>
                  <td>
                    <button
                      className="add-task-button"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="add-task-button"
                      onClick={() => handleDeleteTask(task)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <div>
              <span>Rows per page: </span>
              <select value={tasksPerPage} onChange={handleChangeRowsPerPage}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            <div className="pagination-buttons">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleChangePage(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            ></textarea>
            <div className="popup-buttons">
              <button onClick={handleSaveTask}>Add</button>
              <button onClick={handleCloseAddPopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="popup">
          <div className="popup-inner">
          <img src={deletePic} alt="Profile" />
            <h2>Are you sure you want to delete this task?</h2>
            <h3>{taskToDelete.title}</h3>
            <div className="popup-buttons">
              <button className="red-button" onClick={handleConfirmDeleteTask}>Yes</button>
              <button onClick={handleCloseDeletePopup}>No</button>
            </div>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Edit Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            ></textarea>
            <div className="popup-buttons">
              <button onClick={handleSaveEditTask}>Save</button>
              <button onClick={handleCloseEditPopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
