import jwt from "jsonwebtoken";
import User from "../models/users.models.js"
import { generateAccessandRefreshTokens } from "../utils/tokens.utils.js";

//generates access token on app start
const isUserLoggedIn = async (req, res) => {
    const currentRefreshToken = req.cookies?.refreshToken;
    try {
        const decoded = jwt.verify(currentRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        //check if the user exists in DB
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            })
        }
        //generate new tokens if user found
        const {accessToken,refreshToken} = generateAccessandRefreshTokens(user);
        res
        //Adding cookies
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 })
        .json({
            token: accessToken,
            user: {
                _id: user._id,
                email: user.email,
                fullName : user.fullName,
                userName: user.userName,
                profilePicture: user.profilePicture
            }
        })
    } catch (error) {
        console.log(error.message || error);
        if (error.message === "jwt malformed") {
            return res.status(400).json({
                message: "Refresh token is malformed!"
            })
        }
        if (error.message === "jwt expired") {
            return res.status(400).json({
                message: "Refresh token is expired!"
            })
        }
        return res.status(500).json({
            message: "Something went wrong while authenticating!"
        })
    }
}

//authenticates user when accessing secure routes
const authenticateUser = async (req,res) => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    const {refreshToken} = req.cookies;
    if (!accessToken || !refreshToken) {
        return res.status(401).json({
            message: "No tokens recieved! Login again!"
        })
    }
}

export {isUserLoggedIn}