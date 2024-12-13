import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../reducers/userSlice'
import allBlogsReducer from '../reducers/allBlogsSlice'
import accessTokenReducer from '../reducers/accessTokenSlice.js'
export const store = configureStore({
    reducer: {
        user: userReducer,
        allBlogs : allBlogsReducer,
        token : accessTokenReducer,
    }
})