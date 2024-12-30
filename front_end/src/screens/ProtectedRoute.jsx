import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setAccessToken } from '../config/redux/reducers/accessTokenSlice';
import { addUser } from '../config/redux/reducers/userSlice';
import axios from '../config/api.config.js';
import useRemoveUser from '../utils/app.utils.js';
const ProtectedRoute = ({ component }) => {
    const navigate = useNavigate();
    const tokenSelector = useSelector(state => state.token.accessToken)
    const accessToken = localStorage.getItem('accessToken');
    console.log(tokenSelector);
    const removeUser = useRemoveUser()
    const [userState, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch()
    useEffect(() => {
        const authenticateUser = async () => {
            if (accessToken) {
                console.log("token selector aahay");
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
                    console.log(data);
                    const { token, user, isValid } = data;
                    if (data.token) {
                        dispatch(setAccessToken({ token, }));
                        localStorage.setItem('accessToken', token);
                        dispatch(addUser({ currentUser: user }));
                        setUserState(true);
                        setLoading(false);
                        return;
                    }
                    if (isValid) {
                        setUserState(true)
                        setLoading(false);

                        return;
                    }
                } catch (error) {
                    console.error("Error:", error);
                    setUserState(false)
                    removeUser()
                }
            } else {
                setUserState(false);
            }
            setLoading(false);
        };
        authenticateUser();
    }, [navigate, dispatch]);
    if (loading) {
        return <div className="bg-white w-full h-screen">
        </div>;
    }
    return (
        <div className="bg-white w-full h-screen">
            {userState === true && component}
        </div>
    );
}

export default ProtectedRoute
