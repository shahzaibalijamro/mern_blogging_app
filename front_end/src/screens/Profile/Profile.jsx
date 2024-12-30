import React, { useState } from 'react'
import Greeting from '../../components/Greeting'
import './Profile.css'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../config/redux/reducers/userSlice';
import axios from '../../config/api.config.js';
import { setAccessToken } from '../../config/redux/reducers/accessTokenSlice';
import useRemoveUser from '../../utils/app.utils.js';
import { handleMiddlewareErrors } from '../../utils/error.utils.js';

const Profile = () => {
    const dispatch = useDispatch();
    const removeUser = useRemoveUser()
    const userSelector = useSelector(state => state.user.user.currentUser);
    const tokenSelector = useSelector(state => state.token.accessToken?.token)
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
        e.preventDefault();
        const updateButton = document.getElementsByClassName("updateButton");
        updateButton.innerHTML = "Saving ..."
        try {
            const { data } = await axios.put("/api/v1/update",
                {
                    userName: newUserName,
                    fullName: newFullname
                },
                {
                    headers: {
                        'Authorization': `Bearer ${tokenSelector}`
                    }
                })
            updateButton.innerHTML = "Saved"
            const { user } = data;
            if (user) {
                dispatch(addUser({ currentUser: user }));
                showSnackbar(`Changes made!`, 3000);
            }
            if (data.accessToken) {
                const token = data.accessToken;
                dispatch(setAccessToken({ token, }));
                localStorage.setItem('accessToken', token);
            }
        } catch (error) {
            console.log(error);
            const errorMessage = handleMiddlewareErrors(error);
            showSnackbar(errorMessage, 3000);
            if (errorMessage === "Session expired: Please log in again.") {
                setTimeout(() => {
                    removeUser()
                }, 2000);
            }
            if (errorMessage === "User not found in the system.") {
                setTimeout(() => {
                    removeUser()
                }, 2000);
            }
            if (error.response?.data?.taken) {
                return showSnackbar(`This username is already taken, try another one!`, 3000);
            }
        } finally {
            document.getElementById('my_modal_1').close();
            updateButton.innerHTML = "Save"
        }
    };
    const showResetPasswordModal = () => {
        document.getElementById('my_modal_2').showModal();
    };
    const passwordReset = async (e) => {
        e.preventDefault()
        const passwordButton = document.getElementsByClassName("passwordButton");
        passwordButton.innerHTML = "Updating ..."
        const accessToken = tokenSelector;
        try {
            const { data } = await axios.put("/api/v1/reset", {
                data: {
                    currentPassword: currentPassword, newPassword: newPassword
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            passwordButton.innerHTML = "Updated"
            if (data) {
                showSnackbar(`Password updated!`, 3000)
            }
            if (data.accessToken) {
                const token = data.accessToken;
                dispatch(setAccessToken({ token, }));
                localStorage.setItem('accessToken', token);
            }
        } catch (error) {
            console.log(error.response?.data);
            const errorMessage = handleMiddlewareErrors(error);
            showSnackbar(errorMessage, 3000);
            if (errorMessage === "Session expired: Please log in again.") {
                setTimeout(() => {
                    removeUser()
                }, 2000);
            }
            if (errorMessage === "User not found in the system.") {
                setTimeout(() => {
                    removeUser()
                }, 2000);
            }
            if (error.response.data?.message === "Password does not meet the required criteria!") {
                return showSnackbar(`Your password must be at least 8 characters long and include at least one letter, one number, and one special character (@, $, !, %, , ?, &).`, 5000)
            }
            if (error.response.data.message === "Incorrect Password") {
                return showSnackbar("Incorrect Password!", 2000)
            }
            if (error.response.data.message = "User does not exist!") return removeUser()
        } finally {
            document.getElementById('my_modal_2').close();
            passwordButton.innerHTML = "Update Password"
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
            const { data } = await axios.put("/api/v1/pfp", formData, {
                headers: {
                    'Authorization': `Bearer ${tokenSelector}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            const { user } = data;
            dispatch(addUser({ currentUser: user }));
            showSnackbar(`Profile picture updated!`, 3000);
            if (data.accessToken) {
                const token = data.accessToken;
                dispatch(setAccessToken({ token, }));
                localStorage.setItem('accessToken', token);
            }
        } catch (error) {
            console.log(error)
            const errorMessage = handleMiddlewareErrors(error);
            showSnackbar(errorMessage, 3000);
            if (errorMessage === "Session expired: Please log in again.") {
                setTimeout(() => {
                    removeUser()
                }, 2000);
            }
            if (errorMessage === "User not found in the system.") {
                setTimeout(() => {
                    removeUser()
                }, 2000);
            }
        }
        event.target.value = ''
    }
    const deleteAccount = async () => {
        const deleteButton = document.getElementsByClassName("deleteButton");
        deleteButton.innerHTML = "Deleting..."
        try {
            const { data } = await axios.delete("/api/v1/delete", {
                headers: {
                    'Authorization': `Bearer ${tokenSelector}`
                }
            })
            deleteButton.innerHTML = "Deleted"
            showSnackbar("Sorry to see you go! Your account is deleted—hope to see you again!", 5000)
            setTimeout(() => {
                removeUser()
            }, 3000);
        } catch (error) {
            console.log(error);
            const errorMessage = handleMiddlewareErrors(error);
            showSnackbar(errorMessage, 3000);
            if (errorMessage === "Session expired: Please log in again.") {
                setTimeout(() => {
                    removeUser()
                }, 2000);
            }
            if (errorMessage === "User not found in the system.") {
                setTimeout(() => {
                    removeUser()
                }, 2000);
            }
        } finally {
            document.getElementById('my_modal_3').close();
            deleteButton.innerHTML = "Yes, I am sure"
        }
    }
    return (
        <div style={{
            minHeight: '100vh'
        }}>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-white relative">
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
                            <div className="mt-3 flex justify-between items-center">
                                <button
                                    type="submit"
                                    className="btn text-white postBtn bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                                >
                                    Save
                                </button>
                                <h1
                                    onClick={() => document.getElementById("my_modal_1").close()}
                                    className="text-black font-medium border-b border-black cursor-pointer"
                                >
                                    Back
                                </h1>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box bg-white relative">
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
                            <div className="mt-3 flex justify-between items-center">
                                <button
                                    type="submit"
                                    className="btn passwordButton text-white postBtn bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                                >
                                    Update Password
                                </button>
                                <h1
                                    onClick={() => document.getElementById("my_modal_2").close()}
                                    className="text-black font-medium border-b border-black cursor-pointer"
                                >
                                    Back
                                </h1>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box bg-white relative">
                    <h1
                        onClick={() => document.getElementById("my_modal_3").close()}
                        className="absolute cursor-pointer top-1 right-3 text-black font-bold text-[1.5rem]"
                    >
                        ×
                    </h1>
                    <div className="gap-4 rounded-xl bg-white">
                        <h1 className="text-center font-medium text-black">
                            Are you sure you want to delete your account? This action cannot be undone, and all your blogs will be permanently deleted.
                        </h1>
                        <button
                            onClick={deleteAccount}
                            id="reset-Btn"
                            className="btn mt-3 deleteButton text-white font-bold w-full bg-[#f44336] border-[#f44336] hover:border-[#cf2b1f] btn-active hover:bg-[#cf2b1f] btn-neutral"
                        >
                            Yes, I am sure
                        </button>
                    </div>
                </div>
            </dialog>

            <div id="snackbar"></div>
            <Greeting />
            <div className="my-container">
                <div className="p-[2rem] profile-wrapper w-full bg-white mt-5 gap-4rounded-xl gap-[1.25rem]">
                    <div className="text-center">
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
                                    {userSelector.fullName || userSelector.fullname}
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
                            <div className="text-center flex flex-col justify-center w-max mx-auto items-center">
                                <button
                                    onClick={showResetPasswordModal}
                                    id="reset-Btn"
                                    className="btn mt-5 text-white font-bold bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                                >
                                    Reset Password?
                                </button>
                                <button
                                    onClick={() => document.getElementById("my_modal_3").showModal()}
                                    id="reset-Btn"
                                    className="btn mt-3 text-white font-bold w-full bg-[#f44336] border-[#f44336] btn-active hover:bg-[#cf2b1f] btn-neutral"
                                >
                                    Delete account
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
