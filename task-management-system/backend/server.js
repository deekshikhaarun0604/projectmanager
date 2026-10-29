const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017/taskmanager';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Task Schema and Model
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Ongoing', 'Completed'],
        message: '{VALUE} is not a valid status. Allowed values: Pending, Ongoing, Completed'
      },
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

// Allowed status values
const ALLOWED_STATUSES = ['Pending', 'Ongoing', 'Completed'];

// Routes

// 1. GET /tasks - Retrieve all tasks from MongoDB
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Server error while fetching tasks', details: error.message });
  }
});

// 2. POST /tasks - Create a new task with default status Pending
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;

    // Reject empty or whitespace-only title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Task title is required and cannot be empty or whitespace only' });
    }

    const newTask = new Task({
      title: title.trim(),
      status: 'Pending'
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ error: 'Server error while creating task', details: error.message });
  }
});

// 3. PATCH /tasks/:id - Update task status by ID
app.patch('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    // Validate status presence and value
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ error: 'Server error while updating task', details: error.message });
  }
});

// 4. DELETE /tasks/:id - Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', id: deletedTask._id });
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ error: 'Server error while deleting task', details: error.message });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
