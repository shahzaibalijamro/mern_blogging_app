import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../reducers/userSlice'
import allBlogsReducer from '../reducers/allBlogsSlice'
export const store = configureStore({
    reducer: {
        user: userReducer,
        allBlogs : allBlogsReducer,
    }
})