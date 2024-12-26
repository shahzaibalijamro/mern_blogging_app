import { createSlice } from "@reduxjs/toolkit";
import axios from "../../api.config.js"
const serverStatusSlice = createSlice({
    name: "serverStatus",
    initialState: {
        isServerDown: false,
    },
    reducers: {
        setServerDown: (state, action) => {
            state.isServerDown = action.payload;
        },
    },
});

export const { setServerDown } = serverStatusSlice.actions;

export const checkServerStatus = () => async (dispatch) => {
    try {
        await axios.get("/api/health-check"); // Replace with your health check endpoint
        dispatch(setServerDown(false));
    } catch (error) {
        dispatch(setServerDown(true));
    }
};

export default serverStatusSlice.reducer;