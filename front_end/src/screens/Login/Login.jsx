import React, { useRef, useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addUser } from '../../config/redux/reducers/userSlice';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../config/redux/reducers/accessTokenSlice';
const Login = () => {
  const navigate = useNavigate();
  const [isPasswordHidden,setIsPasswordHidden] = useState(true)
  const usernameOrEmailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const signInUser = async event => {
    event.preventDefault();
    const loginButton = document.getElementById("loginButton")
    loginButton.innerHTML = "Logging in ..."
    const indicator = document.getElementById("h1");
    indicator.classList.add("invisible");
    try {
      const { data } = await axios.post('http://localhost:3000/api/v1/login', {
        userNameOrEmail: usernameOrEmailRef.current.value,
        password: passwordRef.current.value
      }, { withCredentials: true, });
    loginButton.innerHTML = "Logged in"
      const { user, tokens } = data;
      dispatch(setAccessToken({ token: tokens.accessToken }));
      localStorage.setItem('accessToken', tokens.accessToken);
      dispatch(addUser(
        {
          currentUser: user
        }
      ))
      navigate('/')
    } catch (error) {
      console.log(error);
      if (error.response.data.message === "Invalid credentials") {
        const indicator = document.getElementById("h1");
        indicator.innerHTML = "Invalid credentials!"
        indicator.classList.remove("invisible");
      }
    }finally{
    loginButton.innerHTML = "Login"
    }
  }
  return (
    <div className="h-[100vh] flex justify-center p-5 items-center">
      <div className="max-w-xl w-[512px]">
        <h1 className="text-3xl text-center font-semibold text-black mb-5">
          Login
        </h1>
        <div className="bg-white my-box-shadow rounded-lg p-[2.25rem]">
          <form onSubmit={signInUser}>
            <h1 className="text-lg font-medium ms-1 mb-2 text-black">Username or Email</h1>
            <input
              id="emailInput"
              type="text"
              placeholder="Username or Email"
              className="input bg-white input-bordered w-[100%]"
              required
              ref={usernameOrEmailRef}
            />
            <div className='flex justify-between items-center'>
              <h1 className="text-lg font-medium ms-1 mt-5 mb-2 text-black">
                Password
              </h1>
              <h1 onClick={()=> setIsPasswordHidden(!isPasswordHidden)}className="font-normal mt-5 mb-2 text-black cursor-pointer border-b border-black">
                {isPasswordHidden ? "Show" : "Hide"}
              </h1>
            </div>
            <input
              id="passwordInput"
              type={isPasswordHidden ? "password" : "text"}
              placeholder="Enter your password"
              className="input bg-white input-bordered w-[100%]"
              required
              ref={passwordRef}
            />
            <h1 id='h1' className='mt-2 text-center invisible text-[#ff0000] font-medium'>something</h1>
            <div className="text-center">
              <button
              id='loginButton'
                type="submit"
                className="btn bg-[#7749f8] hover:bg-[#6128ff] mt-[0.9rem] text-white border-[#4c68ff]"
              >
                Login
              </button>
              <p className="mt-3 text-[#4c68ff]">
                <Link to={'/register'}>Not a user? Register here!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login