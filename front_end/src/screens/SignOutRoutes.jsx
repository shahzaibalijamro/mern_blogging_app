import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
const SignOutRoutes = ({ component }) => {
    const navigate = useNavigate();
    const [userState, setUserState] = useState(false);
    useEffect(() => {
        try {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserState(true)
                    navigate('/')
                } else {
                    setUserState(false)
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [])
    return (
        <>
            {userState ? null : component}
        </>
    )
}

export default SignOutRoutes
