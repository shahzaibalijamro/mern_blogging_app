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
        const user = new User({ userName, fullName, email, password, profilePicture })

        //generating and adding the tokens midway through
        const { accessToken, refreshToken } = generateAccessandRefreshTokens(user)

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
    const { userNameOrEmail, password } = req.body;
    try {
        if (!userNameOrEmail || !password) {
            return res.status(400).json({ message: "Username, email, and password are required!" });
        }
        const user = await User.findOne({
            $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }]
        });
        if (!user) return res.status(404).json({
            message: "Invalid credentials"
        })
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(401).json({
            message: "Invalid credentials"
        })
        const { accessToken, refreshToken } = generateAccessandRefreshTokens(user)
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
        console.log(error);
        res.status(500).json({ message: "An error occurred during login" });
    }
}


//update user data

const updateUserData = async (req, res) => {
    console.log(req.cookies);
    const { refreshToken } = req.cookies;
    var decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded);
    res.send("done")
    // const { 
    // userName,
    // fullName,
    // profilePicture } = req.body;
}


const resetPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body.data;
        const decoded = req.user;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Insufficient data recieved!"
            })
        }
        const user = await User.findOne({ email: decoded.email })
        if (!user) return res.status(400).json({
            message: "User does not exist!"
        })
        const checkPassword = await bcrypt.compare(currentPassword,user.password);
        if (!checkPassword) return res.status(400).json({
            isPasswordCorrect: false,
            message: "Incorrect Password"
        })
        user.password = newPassword
        await user.save()
        res.status(200).json({
            isPasswordCorrect: true,
            message: "Password updated"
        })
    } catch (error) {
        console.log(error.message || error);
        if (error.message === "Password does not meet the required criteria") {
            return res.status(400).json({
                message: "Password does not meet the required criteria!"
            })
        }
        res.status(400).json({
            message: "Something went wrong"
        })
    }
}

export { registerUser, loginUser, updateUserData, resetPassword }