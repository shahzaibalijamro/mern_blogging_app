import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, emptyUser } from '../config/redux/reducers/userSlice';
import axios from "../config/api.config.js";
import { setAccessToken } from '../config/redux/reducers/accessTokenSlice';
const Navbar = () => {
    const userSelector = useSelector(state => state.user.user.currentUser)
    console.log(userSelector);

    const tokenSelector = useSelector(state => state.token.accessToken?.token)
    console.log(tokenSelector, "==> navbar");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = location.pathname;
    useEffect(() => {
        const validateOrRefreshToken = async () => {
            if (!tokenSelector) {
                // If token is invalid or missing, refresh user data
            try {
                const {data} = await axios.post("/api/v1/auth");
                console.log(data);
                const { user, token } = data;
                dispatch(setAccessToken({ token, }));
                localStorage.setItem('accessToken', token);
                dispatch(addUser({ currentUser: user }));
            } catch (error) {
                console.error("Error refreshing user data:", error);
            }
            }
        };
    
        validateOrRefreshToken();
    }, [tokenSelector, dispatch]);
    
    const logOutUser = async () => {
        try {
            const {data} = await axios.post("/api/v1/logout");
            console.log(data);
            if (data.message === "User logged out successfully") {
                dispatch(emptyUser());
                navigate('/login')
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            {userSelector ? <div className="px-5 navbar bg-[#7749f8] relative text-white">
                <div className="flex-1">
                    <Link to={'/'} className="btn logo btn-ghost text-xl">Blogging App</Link>
                </div>
                <div className="flex-none navbarRight gap-2">
                    <a className="btn btn-ghost nav-username text-xl">{userSelector.fullName || userSelector.fullname}</a>
                    <div className="dropdown items-center dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    id="pfp"
                                    alt="Tailwind CSS Navbar component"
                                    src={userSelector.profilePicture}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            {currentPage === '/dashboard' ? <>
                                <li className="profileBtn">
                                    <Link to={'/'} className="justify-between">
                                        Home
                                    </Link>
                                </li>
                                <li className="profileBtn">
                                    <Link to={'/profile'} className="justify-between">
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-logout-btn">
                                    <a onClick={logOutUser}>Logout</a>
                                </li></> : currentPage === '/profile' ? <><li className="dashboardBtn">
                                    <Link to={'/'}>Home</Link>
                                </li>
                                    <li className="dashboardBtn">
                                        <Link to={'/dashboard'}>Dashboard</Link>
                                    </li>
                                    <li className="nav-logout-btn">
                                        <a onClick={logOutUser}>Logout</a>
                                    </li></> : <>
                                <li className="profileBtn">
                                    <Link to={'/profile'} className="justify-between">
                                        Profile
                                    </Link>
                                </li>
                                <li className="dashboardBtn">
                                    <Link to={'/dashboard'}>Dashboard</Link>
                                </li>
                                <li className="nav-logout-btn">
                                    <a onClick={logOutUser}>Logout</a>
                                </li>
                            </>}
                        </ul>
                    </div>
                </div>
            </div> :
                <div className={currentPage === '/login' || currentPage === '/register' ? "px-5 bg-[#7749f8] navbar text-white" : "px-5 bg-[#7749f8] text-white navbar relative"}>
                    <div className="flex-1">
                        {currentPage === '/login' ? (
                            <a className="btn logo btn-ghost text-xl">Login</a>
                        ) : currentPage === '/register' ? (
                            <a className="btn logo btn-ghost text-xl">Register</a>
                        ) : (
                            <Link to={'/'} className="btn logo btn-ghost text-xl">Blogging App</Link>
                        )}
                    </div>
                    <div className="flex-none navbarRight gap-2">
                        <a className="btn btn-ghost nav-username text-xl" />
                        <div className="dropdown items-center dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        id="pfp"
                                        alt="User Avatar"
                                        src="https://png.pngtree.com/png-vector/20220608/ourmid/pngtree-man-avatar-isolated-on-white-background-png-image_4891418.png"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                {currentPage === '/login' ? <>
                                    <li className="profileBtn">
                                        <Link to={'/'} className="justify-between">
                                            Home
                                        </Link>
                                    </li>
                                    <li className="profileBtn">
                                        <Link to={'/register'} className="justify-between">
                                            Register
                                        </Link>
                                    </li>
                                </> : currentPage === '/register' ?
                                    <><li className="dashboardBtn">
                                        <Link to={'/'}>Home</Link>
                                    </li>
                                        <li className="dashboardBtn">
                                            <Link to={'/login'}>Login</Link>
                                        </li>
                                    </> : <>
                                        <li className="profileBtn">
                                            <Link to={'/login'} className="justify-between">
                                                Login
                                            </Link>
                                        </li>
                                    </>}
                            </ul>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Navbar