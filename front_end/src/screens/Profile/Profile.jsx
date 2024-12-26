import React, { useState } from 'react'
import Greeting from '../../components/Greeting'
import './Profile.css'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../config/redux/reducers/userSlice';
import axios from '../../config/api.config.js';
import { setAccessToken } from '../../config/redux/reducers/accessTokenSlice';
import useRemoveUser from '../../utils/app.utils';

const Profile = () => {
    const dispatch = useDispatch();
    const removeUser = useRemoveUser()
    const userSelector = useSelector(state => state.user.user.currentUser);
    const tokenSelector = useSelector(state => state.token.accessToken?.token)
    console.log(tokenSelector);
    const [newFullname, setNewFullName] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const editUserNameModal = () => {
        document.getElementById('my_modal_1').showModal();
        setNewFullName(userSelector.fullName)
        setNewUserName(userSelector.userName)
    };
    const editUserNameAndFullName = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post("/api/v1/update",
                {
                    userName: newUserName,
                    fullName: newFullname
                },
                {
                    headers: {
                        'Authorization': `Bearer ${tokenSelector}`
                    }
                })
            const { user } = data;
            console.log(data);
            if (user) {
                dispatch(addUser({ currentUser: user }));
                showSnackbar(`Changes made!`, 3000);
            }
            if (data.accessToken) {
                const token = data.accessToken;
                console.log("token recieved from middleware");
                dispatch(setAccessToken({ token, }));
                localStorage.setItem('accessToken', token);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.taken) {
                return showSnackbar(`This username is already taken, try another one!`, 3000);
            }
            if (error.response.data.message = "User does not exist!") return removeUser();
            showSnackbar(`Something went wrong!`, 3000);
        }finally{
            document.getElementById('my_modal_1').close();
        }
    };
    const showResetPasswordModal = () => {
        document.getElementById('my_modal_2').showModal();
    };
    const passwordReset = async (e) => {
        e.preventDefault()
        const accessToken = tokenSelector;
        try {
            const { data } = await axios.post("/api/v1/reset", {
                data: {
                    currentPassword: currentPassword, newPassword: newPassword
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            if (data) {
                showSnackbar(`Password updated!`, 3000)
            }
            if (data.accessToken) {
                const token = data.accessToken;
                console.log("token recieved from middleware");
                
                dispatch(setAccessToken({ token, }));
                localStorage.setItem('accessToken', token);
            }
        } catch (error) {
            console.log(error.response.data);
            if (error.response.data?.message === "Password does not meet the required criteria!") {
                return showSnackbar(`Your password must be at least 8 characters long and include at least one letter, one number, and one special character (@, $, !, %, , ?, &).`, 5000)
            }
            if (error.response.data.message === "Incorrect Password") {
                return showSnackbar("Incorrect Password!", 2000)
            }
            if (error.response.data.message = "User does not exist!") return removeUser()
            // console.log("Niche tak aagaya");
        }finally{
            document.getElementById('my_modal_2').close();
        }
    }
    const showSnackbar = (innerText, time = 3000) => {
        var snackbar = document.getElementById(`snackbar`);
        snackbar.innerHTML = innerText;
        snackbar.style.zIndex = 10000
        snackbar.className = "show";
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, time);
    }
    const clickIcon = () => {
        const fileInput = document.querySelector('#fileInput');
        fileInput.click();
    }
    const editPfp = async (event) => {
        showSnackbar(`Updating profile picture!`, 1500)
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        try {
            const {data} = await axios.post("/api/v1/pfp",formData,{
                headers: {
                    'Authorization' : `Bearer ${tokenSelector}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(data);
            const {user} = data;
            dispatch(addUser({ currentUser: user }));
            showSnackbar(`Profile picture updated!`,3000);
            if (data.accessToken) {
                const token = data.accessToken;
                console.log("token recieved from middleware");
                dispatch(setAccessToken({ token, }));
                localStorage.setItem('accessToken', token);
            }
        } catch (error) {
            console.log(error)
            if (error.response.data.message = "User does not exist!") return removeUser()
            showSnackbar(`Could not update profile picture!`,3000);
        }
        event.target.value = ''
    }
    return (
        <div style={{
            minHeight: '100vh'
        }}>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-white">
                    <div className="gap-4 rounded-xl bg-white">
                        <form method="dialog" className="modal-backdrop" onSubmit={editUserNameAndFullName}>
                            <input
                                type="text"
                                placeholder="Fullname"
                                value={newFullname}
                                onChange={(e) => setNewFullName(e.target.value)}
                                className="input text-[#6c757d] input-bordered w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="input mt-3 text-[#6c757d] input-bordered w-full"
                                required
                            />
                            <div className="mt-3">
                                <button
                                    type="submit"
                                    className="btn text-white postBtn bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                                >
                                    Edit Blog
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box bg-white">
                    <div className="gap-4 rounded-xl bg-white">
                        <form onSubmit={passwordReset}>
                            <input
                                type="text"
                                placeholder="Your current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input text-[#6c757d] input-bordered w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input  mt-3 text-[#6c757d] input-bordered w-full"
                                required
                            />
                            <div className="mt-3">
                                <button
                                    type="submit"
                                    className="btn text-white postBtn bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
            <div id="snackbar"></div>
            <Greeting />
            <div className="my-container">
                <div className="p-[2rem] profile-wrapper w-full bg-white mt-5 gap-4rounded-xl gap-[1.25rem]">
                    <div className="text-center mt-[3rem]">
                        {userSelector ? <>
                            <div className="max-w-[225px] mx-auto relative">
                                <img className="w-full rounded-full mx-auto" id="pfp" src={userSelector.profilePicture} alt="" />
                                <div
                                    onClick={clickIcon}
                                    className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer"
                                    id="editPfpBtn"
                                >
                                    <img src="https://i.ibb.co/3fnjZcF/edit.png" alt="Edit" className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center mt-5 items-center">
                                <h1 className="text-center font-semibold text-[27px] text-black">
                                    {userSelector.fullName}
                                </h1>
                                <h1 className="text-center mt-2 font-semibold text-[22px] text-black">
                                    @{userSelector.userName}
                                </h1>
                                <img
                                    onClick={editUserNameModal}
                                    id="editNameBtn"
                                    src="https://i.ibb.co/3fnjZcF/edit.png"
                                    alt="Edit"
                                    className="w-5 cursor-pointer mt-1 h-5"
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={showResetPasswordModal}
                                    id="reset-Btn"
                                    className="btn mt-5 text-white font-bold bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                                >
                                    Reset Password?
                                </button>
                            </div>
                            <input onChange={editPfp} type="file" id="fileInput" accept="image/*" className="hidden" />
                        </> : <span className="loading loading-spinner loading-lg" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
