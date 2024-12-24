import dotenv from "dotenv"
dotenv.config()
import {app} from "./app.js"
import { blogRouter } from "./src/routes/blogs.routes.js"
import { userRouter } from "./src/routes/users.routes.js"
import { connectDB } from "./src/db/index.js"
import { authRouter } from "./src/routes/auth.routes.js"

app.use("/api/v1", blogRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", authRouter)


connectDB()
.then(()=>{
    app.listen(process.env.PORT,() => {
        console.log("Server running on port ", process.env.PORT)
    })
})
.catch((err)=>{
    console.log("Something went wrong", err)
})