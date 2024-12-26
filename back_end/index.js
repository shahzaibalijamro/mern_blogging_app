import dotenv from "dotenv"
dotenv.config()
import { app } from "./app.js"
import { blogRouter } from "./src/routes/blogs.routes.js"
import { userRouter } from "./src/routes/users.routes.js"
import { connectDB } from "./src/db/index.js"
import { authRouter } from "./src/routes/auth.routes.js"
import mongoose from "mongoose"

app.use("/api/v1", blogRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", authRouter)

app.get("/api/v1/health", async (req, res) => {
    try {
        await mongoose.connection.db.admin().ping();
        res.status(200).json({
            status: "success",
            message: "Server is healthy",
            data: {
                uptime: process.uptime(),
                timestamp: new Date(),
            },
        });
    } catch (error) {
        console.error("Health check failed:", error);

        res.status(500).json({
            status: "error",
            message: "Server is down or encountering an issue",
        });
    }
});


connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Server running on port ", process.env.PORT)
        })
    })
    .catch((err) => {
        console.log("Something went wrong", err)
    })