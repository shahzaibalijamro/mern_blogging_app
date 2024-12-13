import mongoose from "mongoose";
import User from "../models/users.models.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { uploadImageToCloudinary } from "../utils/cloudinary.utils.js";
// generates tokens
const generateAccessandRefreshTokens = function (user) {
    const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ email: user.email, userName: user.userName, _id: user._id, }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10d",
    });
    return { accessToken, refreshToken }
}



// registers User
const registerUser = async (req, res) => {

    //getting data
    const { userName, fullName, email, password } = req.body;
    if (!req.file) return res.status(400).json({
        message: "No file found"
    })
    const image = req.file.path;
    try {

        //uploading image to cloudinary and expecting the url in return
        const profilePicture = await uploadImageToCloudinary(image)

        //creating data instance
        const user = new User({ userName, fullName, email, password,profilePicture })

        //generating and adding the tokens midway through
        const { accessToken, refreshToken } = generateAccessandRefreshTokens(user)
        user.refreshToken = refreshToken

        //saving the data
        await user.save();

        //sending response if user successfully created
        res

            //Adding cookies
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 })

            //status code with json response
            .status(201).json({
                message: "New user created",
                newUser: {
                    userName: user.userName,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                    email: user.email,
                    _id: user._id
                },
                tokens: {
                    accessToken
                }
            })
    } catch (error) {
        //error checking
        if (error.code === 11000) {
            return res.status(400).json({ message: "userName or email already exists." });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
}


const loginUser = async function (req, res) {
    const { userName, email, password } = req.body;
    try {
        if (!userName && !email) return res.status(400).json({
            message: "userName or email is required!"
        })
        const user = await User.findOne(
            {
                $or: [
                    { email: email },
                    { userName: userName }
                ]
            }
        )
        if (!user) return res.status(404).json({
            message: "No user found with such credentials"
        })
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(401).json({
            message: "Invalid credentials"
        })
        const { accessToken, refreshToken } = generateAccessandRefreshTokens(user)
        const updateRefreshTokenInDB = await User.findOneAndUpdate({ $or: [{ email: email }, { userName: userName }] }, { $set: { refreshToken } }, { new: true })
        if (!updateRefreshTokenInDB) return res.status(404).json({ message: "User not found" });
        res
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 })
            .status(200)
            .json({
                message: "User successfully logged in!",
                user: {
                    userName: user.userName,
                    fullname: user.fullName,
                    profilePicture: user.profilePicture,
                    email: user.email,

                    _id: user._id
                },
                tokens: {
                    accessToken
                }
            })
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login" });
    }
}


const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });
        const checkToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!checkToken) return res.status(401).json({
            message: "Invalid or expired token. Please log in again."
        })
        const user = await User.findOneAndUpdate({ email: checkToken.email }, { $set: { refreshToken: '' } }, { new: true })
        if (!user) return res.status(401).json({
            message: "User does not exist"
        })
        res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 0, sameSite: 'strict', });
        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}


//update user data

const updateUserData = async (req,res) => {
    console.log(req.cookies);
    const {refreshToken} = req.cookies;
    var decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded);
    res.send("done")
    // const { 
    // userName,
    // fullName,
    // profilePicture } = req.body;


}



export { registerUser, loginUser, logoutUser,updateUserData }