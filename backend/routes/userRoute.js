import express from 'express';
import { getCurrentUser, login, register, UpdatePassword, updateUser } from '../controlllers/UserController.js';
import  authmiddleware  from '../middleware/auth.js';

const userRouter = express.Router();

//public links
userRouter.post("/register",register);
userRouter.post("/login",login);


//private links
userRouter.get("/me", authmiddleware,getCurrentUser);
userRouter.put("/profile", authmiddleware,updateUser);
userRouter.put("/password", authmiddleware,UpdatePassword);

export default userRouter;