const Task = require("../models/taskModel");

function formatIST(date) {
  if (!date) return null;
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true
  });
}

function formatTask(task) {
  return {
    id: task._id,
    title: task.title,
    completed: task.completed,
    priority: task.priority,
    category: task.category,
    isDeleted: task.isDeleted,
    completedAt: formatIST(task.completedAt),
    deletedAt: formatIST(task.deletedAt),
    createdAt: formatIST(task.createdAt),
    updatedAt: formatIST(task.updatedAt)
  };
}

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isDeleted: false });
    res.json(tasks.map(formatTask));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      priority: req.body.priority || "medium",
      category: req.body.category || "general"
    });
    await task.save();
    res.json(formatTask(task));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updateData = { title: req.body.title };
    if (req.body.completed === true) {
      updateData.completed = true;
      updateData.completedAt = new Date();
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(formatTask(task));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    res.json({ message: "Task deleted", deletedAt: formatIST(task.deletedAt) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};