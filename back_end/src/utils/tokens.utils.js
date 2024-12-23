import jwt from "jsonwebtoken"

const generateAccessandRefreshTokens = function (user) {
    const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ email: user.email, userName: user.userName, _id: user._id, }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10d",
    });
    return { accessToken, refreshToken }
}

export {generateAccessandRefreshTokens}