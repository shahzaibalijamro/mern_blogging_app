import React, { useRef } from 'react'
import './register.css'
import { Link, useNavigate } from 'react-router-dom';
import { addUser, emptyUser } from '../../config/redux/reducers/userSlice.js';
import { useDispatch } from 'react-redux';
import axios from "../../config/api.config.js"
import { setAccessToken } from '../../config/redux/reducers/accessTokenSlice.js';
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fullNameRef = useRef();
  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const fileRef = useRef();
  const showSnackbar = (innerText, time = 3000) => {
    var snackbar = document.getElementById(`mySnackbar`);
    snackbar.innerHTML = innerText;
    snackbar.style.zIndex = 10000
    snackbar.className = "show";
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, time);
  }
  const registerUser = async (event) => {
    event.preventDefault();
    if (passwordRef.current.value !== repeatPasswordRef.current.value) {
      return showSnackbar("Passwords do not match!");
    }
    try {
      console.log(fileRef.current.files[0]);
      const file = fileRef.current.files[0];
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userName", userNameRef.current.value);
      formData.append("fullName", fullNameRef.current.value);
      formData.append("email", emailRef.current.value);
      formData.append("password", passwordRef.current.value);
      const { data } = await axios.post("/api/v1/register", formData);
      showSnackbar(`User registered successfully. Welcome ${data.newUser.fullName}!`, 3000)
      dispatch(setAccessToken({ token: data.tokens.accessToken }));
      dispatch(addUser({ currentUser: data.newUser }));
      localStorage.setItem('accessToken', data.tokens.accessToken);
      setTimeout(() => {
        navigate('/')
      }, 3000)
      console.log(data);
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message;
      if (error.response.data?.message === "Password does not meet the required criteria!") {
        return showSnackbar(`Your password must be at least 8 characters long and include at least one letter, one number, and one special character (@, $, !, %, , ?, &).`, 5000)
      }
      if (error.response.data?.message === "userName or email already exists.") {
        return showSnackbar("An account with this username or email already exists. Please try logging in or use a different username/email.", 5000)
      }
      if (error.response.data?.message === "User validation failed: fullName: Fullname is required!") {
        return showSnackbar("Fullname is required!", 5000)
      }
      if (error.response.data?.message === "User validation failed: userName: Username is required!") {
        return showSnackbar("Username is required!", 5000)
      }
      if (error.response.data?.message === "User validation failed: email: Email is required!") {
        return showSnackbar("Email is required!", 5000)
      }
      if (errorMsg.startsWith("User validation failed: email:")) {
        const msg = errorMsg.replace("User validation failed: email: ", "");
        return showSnackbar(msg, 5000)
      }
      if (error.response.data?.message === "User validation failed: password: Password is required!") {
        return showSnackbar("Password is required!", 5000)
      }
    }
  }
  return (
    <div className="min-h-[100vh] h-full mt-[40px] flex justify-center p-5 items-center">
      <div id="mySnackbar"></div>
      <div className="max-w-xl mb-[30px] w-[512px]">
        <h1 className="text-3xl text-center font-semibold text-black mt-5 mb-5">
          Register
        </h1>
        <div className="bg-white my-box-shadow rounded-lg p-[2.25rem]">
          <form onSubmit={registerUser}>
            <input
              id="registerFirstName"
              type="text"
              placeholder="Enter your fullname"
              className="input bg-white input-bordered w-[100%]"
              required
              minLength={3}
              maxLength={20}
              ref={fullNameRef}
            />
            <input
              id="registerLastName"
              type="text"
              placeholder="Enter your username"
              className="input mt-3 bg-white input-bordered w-[100%]"
              required
              minLength={1}
              maxLength={20}
              ref={userNameRef}
            />
            <input
              id="registerEmail"
              type="email"
              placeholder="Enter your email"
              className="input mt-3 bg-white input-bordered w-[100%]"
              required
              ref={emailRef}
            />
            <input
              id="registerPassword"
              type="password"
              placeholder="Enter your password"
              className="input mt-3 bg-white input-bordered w-[100%]"
              required
              minLength={8}
              ref={passwordRef}
            />
            <input
              id="registerRePassword"
              type="password"
              placeholder="Repeat your password"
              className="input mt-3 bg-white input-bordered w-[100%]"
              required
              minLength={8}
              ref={repeatPasswordRef}
            />
            <div className="text-center mt-3">
              <input
                id="file"
                type="file"
                className="file-input bg-white custom-file-input input-bordered file-input-primary w-[100%] max-w-xs"
                required
                ref={fileRef}
              />
            </div>
            <div className="text-center">
              <button
                className="btn bg-[#7749f8] mt-[1rem] text-white border-[#4c68ff] hover:bg-[#6128ff]"
                type="submit"
              >
                Sign up
              </button>
              <p className="mt-3 text-[#4c68ff]">
                <Link to={'/login'}>Already a user? Login here!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register