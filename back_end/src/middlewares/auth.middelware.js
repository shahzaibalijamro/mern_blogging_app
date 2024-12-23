import jwt from "jsonwebtoken";
import User from "../models/users.models.js"
import { generateAccessandRefreshTokens } from "../utils/tokens.utils.js";
const verifyRequest = async (req, res, next) => {
    const accessToken = req.headers["authorization"]?.split(' ')[1];
    const currentRefreshToken = req.cookies?.refreshToken;
    if (!accessToken) return res.status(401).json({
        message: "No access token recieved!"
    })
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        console.log(error.message || error);
        if (error.message === "jwt malformed") {
            return res.status(400).json({
                message: "The provided token is malformed!"
            })
        }
        if (error.message === "jwt expired") {
            if (!currentRefreshToken) {
                return res.status(401).json({
                    message: "Refresh token not found, Please login again!"
                })
            }
            //check if token is valid
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
                req.tokens = { accessToken };
                req.user = user;
                next()
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
    }
}

export { verifyRequest }