import React, { useRef } from 'react'
import './register.css'
import { Link, useNavigate } from 'react-router-dom';
import { emptyUser } from '../../config/redux/reducers/userSlice.js';
import { useDispatch } from 'react-redux';
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const fileRef = useRef();
  const registerUser = async (event) => {
    event.preventDefault();
    if (!passwordRef.current.value === repeatPasswordRef.current.value) {
      return alert("Passwords do not match!");
    }
    try {
      const url = await uploadImage(fileRef.current.files[0], emailRef.current.value)
      await signUpUser({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        name: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
        pfp: url
      }).then(res => {
        console.log(res)
      })
      await signOutUser();
      dispatch(emptyUser());
      navigate('/login')
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h-[100vh] h-full mt-[40px] flex justify-center p-5 items-center">
      <div className="max-w-xl mb-[30px] w-[512px]">
        <h1 className="text-3xl text-center font-semibold text-black mt-5 mb-5">
          Register
        </h1>
        <div className="bg-white my-box-shadow rounded-lg p-[2.25rem]">
          <form onSubmit={registerUser}>
            <input
              id="registerFirstName"
              type="text"
              placeholder="Enter your firstname"
              className="input bg-white input-bordered w-[100%]"
              required
              minLength={3}
              maxLength={20}
              ref={firstNameRef}
            />
            <input
              id="registerLastName"
              type="text"
              placeholder="Enter your lastname"
              className="input mt-3 bg-white input-bordered w-[100%]"
              required
              minLength={1}
              maxLength={20}
              ref={lastNameRef}
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