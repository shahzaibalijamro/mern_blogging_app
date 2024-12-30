import mongoose from "mongoose";
import blogModel from "../models/blogs.models.js";
import UserModel from "../models/users.models.js";

const addBlog = async (req, res) => {
    const user = req.user;
    const accesstoken = req.tokens?.accessToken;
    let session;
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Blog title,description is required!" });
        }
        session = await mongoose.startSession();
        session.startTransaction();
        const newblog = await blogModel.create([{ title, description, author : user._id}],{session})
        const updateUser = await UserModel.findByIdAndUpdate(
            user._id,
            { $push: { publishedBlogs: newblog[0]._id } },
            { new: true, session }
        )
        .select("publishedBlogs")
        .populate({
            path: "publishedBlogs",
            options: { sort: { createdAt: -1 } },
        });
        if (!newblog || !updateUser) {
            await session.abortTransaction();
            return res.status(500).json({
                message: "Could not add the blog!"
            })
        }
        await session.commitTransaction()
        res.status(201).json({
            message: "Blog added",
            publishedBlogs: updateUser.publishedBlogs,
            blog: newblog,
            ...(accesstoken && {accesstoken})
        })
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        res.status(500).json({
            message: "An error occurred while adding the blog"
        })
    }finally{
        await session.endSession();
    }
}


//gets all Blogs
const allBlogs = async (req, res) => {
    try {
        const allBlogs = await blogModel.find({}).populate("author", "-password -refreshToken -publishedBlogs");
        res.status(200).json({
            message: "All Blogs",
            allBlogs,
        })
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch all Blogs"
        })
    }
}


//gets single blog
const singleUserBlogs = async (req, res) => {
    const user = req.user;
    const accessToken = req.tokens?.accessToken;
    const { author } = req.params;
    const { sort } = req.params;
    const sortByLatest = sort === "true";
    if ((!author || !mongoose.Types.ObjectId.isValid(author)) && !user) {
        return res.status(400).json({
            message: "Invalid author ID"
        })
    }
    try {
        const getSingleUserBlogs = await blogModel.find({author: author || user.id || user._id}).populate("author", "-password -refreshToken -publishedBlogs").sort(sort === "false" ? { createdAt: 1 } : { createdAt: -1 });
        if (!getSingleUserBlogs) {
            return res.status(404).json({
                message: "No blogs found"
            });
        }
        res.status(200).json({
            blogs: getSingleUserBlogs,
            ...(accessToken && {accessToken})
        })
    } catch (error) {
        console.log(error.message || error);
        res.status(500).json({
            message: "Could not fetch single user blogs"
        })
    }
}


//deletes Blogs
const deleteBlog = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid ID",
        })
    }
    try {
        const deletedBlog = await blogModel.findByIdAndDelete(id)
        if (!deletedBlog) {
            res.status(404).json({
                message: "blog not found",
            })
        }
        res.status(200).json({
            message: "blog deleted successfully",
            deletedBlog
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not delete blog",
        })
    }
}


//edits Blogs
const editBlog = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid ID!"
        })
    }
    if (!title || !description) {
        res.status(400).json({
            message: "Title and description not provided!"
        })
        return
    }
    try {
        const updatedblog = await blogModel.findByIdAndUpdate(id,
            { title, description }, { new: true, runValidators: true })
        if (!updatedblog) {
            return res.status(404).json({
                message: "blog not found"
            });
        }
        res.status(200).json({
            message: "blog updated",
            updatedblog,
        })
    } catch (error) {
        res.status(500).json({
            message: "Could not update blog"
        })
    }
}

export { addBlog, allBlogs, editBlog, singleUserBlogs, deleteBlog }