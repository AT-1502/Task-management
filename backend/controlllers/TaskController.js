import Task from "../models/TaskModel.js";


// create new task
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed  } = req.body;
        const newTask = new Task({ title, description, priority, dueDate, completed:completed === "yes" || completed === "true", owner:req.user._id });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// get all tasks for logged in user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//get single task by id(Must belong to logged in user)
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// update task by id (Must belong to logged in user)
export const updateTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            { title, description, priority, dueDate, completed: completed === "yes" || completed === "true" },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// delete task by id (Must belong to logged in user)
export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}