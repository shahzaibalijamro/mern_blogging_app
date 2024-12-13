import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
const ProtectedRoute = ({ component }) => {
    const navigate = useNavigate();
    const tokenSelector = useSelector(state => state.token.accessToken)
    const [userState, setUserState] = useState(false);
    useEffect(() => {
        try {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserState(true)
                } else {
                    setUserState(false)
                    navigate('/login')
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [])
    return (
        <>
            {userState ? component : null}
        </>
    )
}

export default ProtectedRoute
