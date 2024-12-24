import express from "express"
import { checkTokenExpiration, loginUser, logoutUser, refreshUser, registerUser,resetPassword,updateUserData } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middelware.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";
import { authenticateUser, isUserLoggedIn } from "../controllers/auth.controllers.js";
const userRouter = express.Router();

//authenticate User on app start
userRouter.post("/auth", isUserLoggedIn)

//authenticate user when accessing protected routes
userRouter.post("/protected", authenticateUser)

//register User
userRouter.post("/register", upload.single("image"), registerUser)

//login User
userRouter.post("/login", loginUser)

//logout User
userRouter.post("/logout",verifyRequest, logoutUser)

//update User
userRouter.post("/update",verifyRequest, updateUserData)

//give new tokens
userRouter.get("/refresh", refreshUser)

//check if the token is expired or not
userRouter.post("/check", checkTokenExpiration)

//reset Password
userRouter.post("/reset",verifyRequest, resetPassword)

export { userRouter }