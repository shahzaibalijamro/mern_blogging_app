import jwt from "jsonwebtoken";

const verifyRequest = async (req,res,next) => {
    const accessToken = req.headers["authorization"]?.split(' ')[1];
    console.log(accessToken, "==>");
    if (!accessToken) return res.status(401).json({
        message: "No access token recieved!"
    })
    try {
        const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        console.log(error.message || error);
        if (error.message === "jwt malformed") {
            return res.status(400).json({
                message: "The provided token is malformed!"
            })
        }
    }finally{
        next()
    }
}

export {verifyRequest}