import express from "express"
import { authenticateUser, isUserLoggedIn, logoutUser } from "../controllers/auth.controllers.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";

const authRouter = express.Router();

//authenticate User on app start
authRouter.post("/auth", isUserLoggedIn)

//authenticate user when accessing protected routes
authRouter.post("/protected", authenticateUser)

//logout User
authRouter.post("/logout", logoutUser)



export { authRouter }