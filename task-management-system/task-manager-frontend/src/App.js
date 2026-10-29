import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [alert, setAlert] = useState(null); // { type: 'success' | 'danger', message: string }
  const [loading, setLoading] = useState(false);

  // Helper to show alert with auto-clear after 4 seconds
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const clearAlert = () => {
    setAlert(null);
  };

  // Fetch all tasks from MongoDB on component mount
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showAlert(
        error.response?.data?.error || 'Unable to connect to the backend server. Please verify the backend is running on port 5000.',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle adding a new task
  const handleAddTask = async (e) => {
    e.preventDefault();

    // Validate empty or whitespace-only title
    if (!taskTitle || taskTitle.trim().length === 0) {
      showAlert('Task title cannot be blank.', 'danger');
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL, {
        title: taskTitle.trim()
      });

      // Add new task to state immediately
      setTasks((prevTasks) => [response.data, ...prevTasks]);
      setTaskTitle('');
      showAlert('Task created successfully!', 'success');
    } catch (error) {
      console.error('Error creating task:', error);
      showAlert(
        error.response?.data?.error || 'Failed to create task. Please check server connection.',
        'danger'
      );
    }
  };

  // Handle status update (PATCH)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}`, {
        status: newStatus
      });

      // Update state without full page reload
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === id ? response.data : t))
      );
      showAlert(`Task marked as ${newStatus}!`, 'success');
    } catch (error) {
      console.error('Error updating task status:', error);
      showAlert(
        error.response?.data?.error || 'Failed to update task status.',
        'danger'
      );
    }
  };

  // Handle task deletion (DELETE)
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);

      // Remove from state immediately
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      showAlert('Task deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
      showAlert(
        error.response?.data?.error || 'Failed to delete task.',
        'danger'
      );
    }
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter((t) => t.status === 'Pending');
  const ongoingTasks = tasks.filter((t) => t.status === 'Ongoing');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render a task item card
  const renderTaskCard = (task) => {
    return (
      <div key={task._id} className="task-item-card">
        <div className="task-card-title">{task.title}</div>
        <div className="task-card-meta">
          <span>Status: <strong>{task.status}</strong></span>
          {task.createdAt && <span> • Created: {formatDate(task.createdAt)}</span>}
        </div>
        <div className="task-card-actions">
          {/* Do not show 'Mark as Ongoing' button when task is already Ongoing */}
          {task.status !== 'Ongoing' && (
            <button
              type="button"
              className="btn btn-action btn-mark-ongoing"
              onClick={() => handleUpdateStatus(task._id, 'Ongoing')}
            >
              Mark as Ongoing
            </button>
          )}

          {/* Do not show 'Mark as Completed' button when task is already Completed */}
          {task.status !== 'Completed' && (
            <button
              type="button"
              className="btn btn-action btn-mark-completed"
              onClick={() => handleUpdateStatus(task._id, 'Completed')}
            >
              Mark as Completed
            </button>
          )}

          {/* Delete Task button */}
          <button
            type="button"
            className="btn btn-action btn-delete-task"
            onClick={() => handleDeleteTask(task._id)}
          >
            Delete Task
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Task Manager</h1>
        <p className="dashboard-subtitle">Manage your project workflow effortlessly across Pending, Ongoing, and Completed stages</p>
      </header>

      {/* Global Alert Notification */}
      {alert && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show alert-custom mb-4`}
          role="alert"
        >
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={clearAlert}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Add Task Form */}
      <section className="task-form-card">
        <form onSubmit={handleAddTask} className="row g-2 align-items-center">
          <div className="col-12 col-md-9 col-lg-10">
            <input
              type="text"
              className="form-control task-input-field"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3 col-lg-2">
            <button type="submit" className="btn btn-primary w-100 btn-add-task">
              Add Task
            </button>
          </div>
        </form>
      </section>

      {/* Loading state indicator */}
      {loading && (
        <div className="text-center my-3 text-secondary">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Loading tasks from database...
        </div>
      )}

      {/* Three Columns Section */}
      <div className="row g-4">
        {/* Column 1: Pending Tasks */}
        <div className="col-12 col-lg-4">
          <div className="column-card">
            <div className="column-header header-pending">
              <span>Pending Tasks</span>
              <span className="column-count-badge badge-pending">
                {pendingTasks.length}
              </span>
            </div>
            <div className="column-body">
              {pendingTasks.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-text">No pending tasks</p>
                </div>
              ) : (
                pendingTasks.map((task) => renderTaskCard(task))
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Ongoing Tasks */}
        <div className="col-12 col-lg-4">
          <div className="column-card">
            <div className="column-header header-ongoing">
              <span>Ongoing Tasks</span>
              <span className="column-count-badge badge-ongoing">
                {ongoingTasks.length}
              </span>
            </div>
            <div className="column-body">
              {ongoingTasks.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-text">No ongoing tasks</p>
                </div>
              ) : (
                ongoingTasks.map((task) => renderTaskCard(task))
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Completed Tasks */}
        <div className="col-12 col-lg-4">
          <div className="column-card">
            <div className="column-header header-completed">
              <span>Completed Tasks</span>
              <span className="column-count-badge badge-completed">
                {completedTasks.length}
              </span>
            </div>
            <div className="column-body">
              {completedTasks.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-text">No completed tasks</p>
                </div>
              ) : (
                completedTasks.map((task) => renderTaskCard(task))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
