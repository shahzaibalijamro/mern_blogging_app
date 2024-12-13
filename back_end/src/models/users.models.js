import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: [true, 'Fullname is required!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message: props => `${props.value} is not a valid email address!`,
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    profilePicture: {
        type: String,
        required: [true, "Profile picture is required!"]
    },
    refreshToken: {
        type: String,
        required: [true, 'Refresh token is required!']
    },
    publishedBlogs: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "blog"
        },]
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified()) return next()
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})

export default mongoose.model("User", userSchema, 'users')