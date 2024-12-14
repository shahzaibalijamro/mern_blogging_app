import React, { useState } from 'react'
import Greeting from '../../components/Greeting'
import './Profile.css'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../config/redux/reducers/userSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const userSelector = useSelector(state => state.user.user.currentUser);
    const [newFullname, setNewFullName] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // !userSelector ? getData("users", auth.currentUser.uid)
    //     .then(arr => {
    //         dispatch(addUser(
    //             {
    //                 user: arr
    //             }
    //         ))
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // : null
    const editUser = async () => {
        console.log(123);
    }
    const showNameModal = () => {
        document.getElementById('my_modal_1').showModal();
        setNewFullName(userSelector.fullName)
        setNewUserName(userSelector.userName)
    };
    const showResetPasswordModal = () => {
        document.getElementById('my_modal_2').showModal();
        setNewFullName(userSelector.fullName)
        setNewUserName(userSelector.userName)
    };
    const showSnackbar = (innerText, time = 3000) => {
        var snackbar = document.getElementById(`snackbar`);
        snackbar.innerHTML = innerText;
        snackbar.className = "show";
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, time);
    }
    const passwordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, userSelector.email)
            showSnackbar(`Password reset email has been sent to your registered email address at <br/> ${userSelector.email}!`)
        } catch (error) {
            console.log(error);
        }
    }
    const clickIcon = () => {
        const fileInput = document.querySelector('#fileInput');
        fileInput.click();
    }
    const editPfp = async (event) => {
        showSnackbar(`Updating profile picture!`, 1500)
        const file = event.target.files[0];
        try {
            const url = await uploadImage(file, userSelector.email)
            const dpRef = doc(db, "users", userSelector.id);
            await updateDoc(dpRef, {
                pfp: url
            })
            dispatch(addUser(
                {
                    user: {
                        ...userSelector,
                        pfp: url
                    }
                }
            ))
            showSnackbar(`Profile picture updated!`);
            await getMyBlogs('pfp', url);
        } catch (error) {
            console.log(error)
        }
        event.target.value = ''
    }
    const editName = async () => {
        const editedVal = prompt("Enter new name!");
        if (!editedVal || editedVal.trim() === "") {
            alert('Please enter a valid name!');
            return;
        }
        try {
            const nameRef = doc(db, "users", userSelector.id);
            await updateDoc(nameRef, {
                name: editedVal
            })
            console.log("Name successfully updated in Firestore!");
            dispatch(addUser(
                {
                    user: {
                        ...userSelector,
                        name: editedVal
                    }
                }
            ))
            showSnackbar(`Name updated!`)
            await getMyBlogs('name', editedVal);
        } catch (err) {
            console.error("Error updating document:", err);
        }
    };
    const currentUserBlogs = [];
    async function getMyBlogs(key, value) {
        const usersRef = collection(db, "blogs");
        const q = query(usersRef, where("uid", "==", userSelector.uid));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                currentUserBlogs.push({
                    id: doc.id
                })
            });
            for (let i = 0; i < currentUserBlogs.length; i++) {
                const editedVal = value;
                const userNameRef = doc(db, "blogs", currentUserBlogs[i].id);
                await updateDoc(userNameRef, {
                    [key]: editedVal
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div style={{
            minHeight: '100vh'
        }}>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-white">
                    <div className="gap-4 rounded-xl bg-white">
                        <form method="dialog" className="modal-backdrop" onSubmit={editUser}>
                            <input
                                type="text"
                                placeholder="Edit Blog Title"
                                value={newFullname}
                                onChange={(e) => setNewFullName(e.target.value)}
                                className="input text-[#6c757d] input-bordered w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Edit Blog Title"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="input  mt-3 text-[#6c757d] input-bordered w-full"
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
                        <form method="dialog" className="modal-backdrop" onSubmit={editUser}>
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
                                    Edit Blog
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
                                    onClick={showNameModal}
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
