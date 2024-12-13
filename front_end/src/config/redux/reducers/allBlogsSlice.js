import { createSlice } from "@reduxjs/toolkit";
export const allBlogsSlice = createSlice({
    name: 'allBlogs',
    initialState: {
        blogs: []
    },
    reducers: {
        addAllBlogs: (state, action) => {
            const {response} = action.payload
            state.blogs.push(...response);
        }
    }
})

export const { addAllBlogs } = allBlogsSlice.actions
export default allBlogsSlice.reducer