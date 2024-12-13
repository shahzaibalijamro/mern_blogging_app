import { createSlice } from "@reduxjs/toolkit";
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        addUser: (state, action) => {
            const {user} = action.payload
            state.user = user
        },
        emptyUser : (state,action) => {
            state.user = {}
        }
    }
})

export const { addUser, emptyUser } = userSlice.actions
export default userSlice.reducer