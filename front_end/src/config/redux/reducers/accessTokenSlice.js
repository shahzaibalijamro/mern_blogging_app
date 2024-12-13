import { createSlice } from "@reduxjs/toolkit";
export const accessTokenSlice = createSlice({
    name: 'user',
    initialState: {
        accessToken: null
    },
    reducers: {
        setAccessToken: (state, action) => {
            const token = action.payload
            state.accessToken = token
        },
        emptyAccessToken : (state,action) => {
            state.user = null
        }
    }
})

export const { setAccessToken, emptyAccessToken } = accessTokenSlice.actions
export default accessTokenSlice.reducer