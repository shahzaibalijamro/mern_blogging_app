import express from "express"
import {  loginUser,registerUser,resetPassword,updateUserData } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middelware.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";
const userRouter = express.Router();

//register User
userRouter.post("/register", upload.single("image"), registerUser)

//login User
userRouter.post("/login", loginUser)

//update User
userRouter.post("/update",verifyRequest, updateUserData)

//reset Password
userRouter.post("/reset",verifyRequest, resetPassword)

export { userRouter }