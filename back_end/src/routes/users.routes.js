import express from "express"
import { loginUser, logoutUser, registerUser,updateUserData } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middelware.js";

const userRouter = express.Router();

//register User
userRouter.post("/register", upload.single("image"), registerUser)

//login User
userRouter.post("/login", loginUser)

//logout User
userRouter.post("/logout", logoutUser)

//update User
userRouter.post("/update", updateUserData)

export { userRouter }