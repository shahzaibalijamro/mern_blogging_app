import jwt from "jsonwebtoken";
import User from "../models/users.models.js"
const verifyRequest = async (req, res, next) => {
    const accessToken = req.headers["authorization"]?.split(' ')[1];
    const currentRefreshToken = req.cookies?.refreshToken;
    // if (!accessToken) return res.status(401).json({
    //     message: "No access token recieved!"
    // })
    try {
        const decode = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NTYiLCJlbWFpbCI6IlNoYWh6YWliIiwiaWF0IjoxNzM0OTYxNzM0LCJleHAiOjE3MzQ5NjE3MzV9.aoWKHbWWuSyLbFh2fOW9qelimfUhq9NblIftLvaqLek", process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        console.log(error.message || error);
        // if (error.message === "jwt malformed") {
        //     return res.status(400).json({
        //         message: "The provided token is malformed!"
        //     })
        // }
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
            // return res.status(400).json({
            //     message: "The provided token is expired!"
            // })
        }
    } finally {
        next()
    }
}

export { verifyRequest }