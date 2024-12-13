import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

export {app}