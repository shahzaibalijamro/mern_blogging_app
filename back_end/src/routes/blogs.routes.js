import express from "express"
import { addBlog, allBlogs, editBlog, singleUserBlogs, deleteBlog} from "../controllers/blogs.controllers.js";
import { verifyRequest } from "../middlewares/auth.middelware.js";

const blogRouter = express.Router();

//add blog
blogRouter.post("/addblog", addBlog)

//get all blogs
blogRouter.get("/allblogs",verifyRequest, allBlogs)

//edit blogs
blogRouter.put("/editblog/:id", editBlog)

//get single blogs

blogRouter.get("/singleuserblogs/:author", singleUserBlogs)

//delete blog
blogRouter.delete("/deleteblog/:id", deleteBlog)

export { blogRouter }