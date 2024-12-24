import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setAccessToken } from '../config/redux/reducers/accessTokenSlice';
import { addUser } from '../config/redux/reducers/userSlice';
import axios from '../config/api.config.js';
const ProtectedRoute = ({ component }) => {
    const navigate = useNavigate();
    const tokenSelector = useSelector(state => state.token.accessToken)
    console.log(tokenSelector); // Add this to check if the token is present
    const [userState, setUserState] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        const authenticateUser = async () => {
            if (tokenSelector) {
                console.log("token selector aahay");
                try {
                    const { data } = await axios.post(
                        "/api/v1/protected",
                        {},
                        {
                            headers: {
                                "authorization": `Bearer ${tokenSelector.token}`,
                            }
                        }
                    );
                    console.log(data);
                    // if (response.data.isValid) {
                    //     setUserState(true)
                    //     return;
                    // }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
            // // If token is invalid or missing, refresh user data
            // try {
            //     const { data } = await axios.get("http://localhost:3000/api/v1/refresh", {
            //         withCredentials: true,
            //     });
            //     const { user, accessToken } = data;
            //     dispatch(setAccessToken({ token: accessToken }));
            //     dispatch(addUser({ currentUser: user }));
            //     setUserState(true)
            // } catch (error) {
            //     console.error("Error refreshing user data:", error);
            //     return navigate('/login')
            // }
        };

        authenticateUser();
    }, [tokenSelector, dispatch]);
    // useEffect(() => {
    //     try {
    //         onAuthStateChanged(auth, async (user) => {
    //             if (user) {
    //                 setUserState(true)
    //             } else {
    //                 setUserState(false)
    //                 navigate('/login')
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }, [])
    return (
        <>
            {userState ? component : <div className='h-screen w-full bg-white'></div>}
        </>
    )
}

export default ProtectedRoute
