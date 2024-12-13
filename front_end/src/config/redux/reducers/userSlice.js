import { createSlice } from "@reduxjs/toolkit";
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        addUser: (state, action) => {
            const currentUser = action.payload
            state.user = {...currentUser}
        },
        emptyUser : (state,action) => {
            state.user = {}
        }
    }
})

export const { addUser, emptyUser } = userSlice.actions
export default userSlice.reducer