import express from 'express';
import authmiddleware from '../middleware/auth.js';

import { getTasks, createTask,getTaskById , updateTask, deleteTask } from '../controlllers/TaskController.js';

const taskRouter = express.Router();

taskRouter.route('/gp')
    .get(authmiddleware, getTasks)
    .post(authmiddleware, createTask);

taskRouter.route('/:id/gp')
    .get(authmiddleware, getTaskById) // Assuming you want to get a task by ID
    .put(authmiddleware, updateTask) // Assuming you want to update a task by ID
    .delete(authmiddleware,deleteTask); // Assuming you want to delete a task by ID

export default taskRouter;