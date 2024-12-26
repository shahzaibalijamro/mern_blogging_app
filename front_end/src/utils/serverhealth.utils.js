import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkServerStatus } from "../config/redux/reducers/serverHealthSlice";

const ServerStatusChecker = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkServerStatus());
        const interval = setInterval(() => {
            dispatch(checkServerStatus());
        }, 30000);

        return () => clearInterval(interval);
    }, [dispatch]);

    return null;
};

export default ServerStatusChecker;