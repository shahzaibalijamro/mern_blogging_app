import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../config/api.config.js";
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../config/redux/reducers/accessTokenSlice';
import { addUser } from '../config/redux/reducers/userSlice';

const SignOutRoutes = ({ component }) => {
    const tokenSelector = useSelector(state => state.token.accessToken);
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userState, setUserState] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const authenticateUser = async () => {
            if (accessToken) {
                try {
                    const { data } = await axios.post(
                        "/api/v1/protected",
                        {},
                        {
                            headers: {
                                "authorization": `Bearer ${accessToken}`,
                            }
                        }
                    );
                    const { token, user, isValid } = data;
                    if (token) {
                        dispatch(setAccessToken({ token }));
                        localStorage.setItem('accessToken', token);
                        dispatch(addUser({ currentUser: user }));
                        console.log("if token");
                        
                        navigate('/');
                        return;
                    }
                    if (isValid) {
                        console.log("isValid");

                        navigate('/');
                        return;
                    }
                } catch (error) {
                    console.error("Error:", error);
                    setUserState(false);
                }
            } else {
                setUserState(false);
            }
            setLoading(false);
        };
        authenticateUser();
    }, [dispatch, navigate]);
    if (loading) {
        return <div className="bg-white w-full h-screen">
        </div>;
    }
    return (
        <div className="bg-white w-full h-screen">
            {userState === false && component}
        </div>
    );
};

export default SignOutRoutes;