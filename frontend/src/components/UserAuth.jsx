import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  EnvelopeIcon,
  UserIcon,
  PhoneIcon,
  CodeIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { userLogin, userSignup } from "../api/AuthApi";

export default function UserAuth({
  setUserAuth,
  userAuth,
  adminAuth,
  setAdminAuth,
  setAlert,
  alert,
  loading,
  setLoading,
  setIsLog
}) {
  const [signupData, setSignupData] = useState({
    name: "",
    phone_number: "",
    email: "",
    code: "",
    password: "",
    c_password: "",
    otp: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [viewPw, setViewPw] = useState(false);
  const [viewCPw, setViewCPw] = useState(false);

  function changeViewPw() {
    setViewPw((curr) => {
      return !curr;
    });
  }

  function changeViewCPw() {
    setViewCPw((curr) => {
      return !curr;
    });
  }

  function onSignupChange(event) {
    setSignupData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function onLoginChange(event) {
    setLoginData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    if(userAuth.page === 'login') {
      if(loginData.email === '' || loginData.password === '') {
        setAlert({msg: 'All the details must be filled.', state: true})
        return
      }
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email);
      if(!isEmailValid) {
        setAlert({msg: 'Enter a valid email.', state: true})
        return;
      }
      try {
        setLoading(true)
        let response = await userLogin(loginData);
        if(response) {
          setAlert({msg: 'Login Successful.', state: true})
          let token = response.access_token
          document.cookie = `user_jwt=${token};path=/;`
          setUserAuth({state: false, page: ''})
          setIsLog(true)
        }
        setLoading(false)
      } catch(err) {
        setAlert({msg: 'Login Failed. ' + String(err.message), state: true})
      } finally {
        setLoading(false)
      }

    } else if(userAuth.page === 'signup') {
      if(signupData.email === '' || signupData.password === '' || signupData.c_password === '' || signupData.code === '' || signupData.name === '' || signupData.phone_number === '' || signupData.otp === '') {
        setAlert({msg: 'All the details must be filled.', state: true})
        return;
      }
      if(signupData.phone_number.length != 10) {
        setAlert({msg: 'Enter a valid phone number.', state: true})
        return;
      }
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email);
      if(!isEmailValid) {
        setAlert({msg: 'Enter a valid email.', state: true})
        return
      }
      try {
        if(signupData.password !== signupData.c_password) {
          setAlert({ msg: "Passwords do not match.", state: true });
          return;
        }
        setLoading(true)
        let response = await userSignup(signupData);
        if(response) {
          setAlert({msg: 'Signup Successful.', state: true})
          setUserAuth({state: true, page: 'login'})
        }
        setLoading(false)
      } catch(err) {
        setAlert({state: true, msg: 'Signup Failed. ' + String(err.message)})
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="overlay absolute inset-0 bg-black/60 z-1"
        onClick={() => {
          setUserAuth({ state: false, page: "" });
        }}
      ></div>

      {/* Auth Container */}
      <div
        className="
          bg-(--pure-white)
          flex
          flex-col
          items-center
          w-100
          h-fit
          border
          rounded-2xl
          gap-5
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          z-2
        "
      >
        {/* Login / Signup Toggle */}
        <div className="relative flex w-55 h-10 mt-4 overflow-hidden rounded-lg border">
          {/* Active Sign Up Background */}
          {userAuth.page === "signup" && (
            <div
              className="absolute inset-0 bg-(--bg) z-0"
              style={{
                clipPath: "polygon(0 0, 53% 0, 47% 100%, 0 100%)",
              }}
            />
          )}

          {/* Active Login Background */}
          {userAuth.page === "login" && (
            <div
              className="absolute inset-0 bg-(--bg) z-0"
              style={{
                clipPath: "polygon(53% 0, 100% 0, 100% 100%, 47% 100%)",
              }}
            />
          )}

          {/* Sign Up Button */}
          <button
            type="button"
            onClick={() => {
              setUserAuth({
                state: true,
                page: "signup",
              });
              setAdminAuth({
                state: false,
                page: "",
              });
            }}
            className={`relative z-10 flex-1 h-full text-2xl font-semibold
              ${userAuth.page === "signup" ? "text-(--orange)" : ""}`}
          >
            Sign Up
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => {
              setUserAuth({
                state: true,
                page: "login",
              });
              setAdminAuth({
                state: false,
                page: "",
              });
            }}
            className={`relative z-10 flex-1 h-full text-2xl font-semibold
              ${userAuth.page === "login" ? "text-(--orange)" : ""}`}
          >
            Login
          </button>

          {/* Diagonal Separator */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[calc(100%+16px)]
              w-px
              -translate-x-1/2
              -translate-y-1/2
              rotate-20
              bg-black
              z-20
            "
          />
        </div>

        {/* User Icon */}
        <div>
          <svg
            width="100"
            height="100"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-full"
          >
            <defs>
              {/* Orange Gradient */}
              <linearGradient
                id="orangeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#C2872E" />
                <stop offset="50%" stopColor="#B47B27" />
                <stop offset="100%" stopColor="#A9701E" />
              </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle cx="100" cy="100" r="98" fill="url(#orangeGradient)" />

            {/* User Head */}
            <circle cx="100" cy="80" r="28" fill="#FFFFFF" fillOpacity="0.9" />

            {/* User Body */}
            <path
              d="
                M 50 165
                C 50 125 72 108 100 108
                C 128 108 150 125 150 165
                Z
              "
              fill="#FFFFFF"
              fillOpacity="0.9"
            />

            {/* Circle Clip */}
            <clipPath id="orangeCircleClip">
              <circle cx="100" cy="100" r="98" />
            </clipPath>
          </svg>
        </div>

        {/* ============ LOGIN FORM ============ */}

        {userAuth.page === "login" ? (
          <form className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex border rounded-lg px-2 py-1">
              <EnvelopeIcon size={24} className="text-(--orange)" />

              <input
                type="email"
                placeholder="Email"
                name="email"
                id="login-email"
                value={loginData.email}
                onChange={onLoginChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Password */}
            <div className="flex border rounded-lg px-2 py-1">
              <LockIcon size={24} className="text-(--orange)" />

              <input
                type={viewPw ? "text" : "password"}
                placeholder="Password"
                name="password"
                id="login-password"
                value={loginData.password}
                onChange={onLoginChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />

              {viewPw ? (
                <EyeSlashIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--orange)"
                  onClick={changeViewPw}
                />
              ) : (
                <EyeIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--orange)"
                  onClick={changeViewPw}
                />
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="
                flex
                gap-6
                items-center
                justify-center
                font-semibold
                border
                rounded-lg
                w-full
                h-10
                hover:cursor-pointer
                bg-[linear-gradient(90deg,#A9701E_0%,#C2872E_100%)]
                text-white
                transition-all
                duration-300
                hover:shadow-[0_0_20px_rgba(194,135,46,0.5)]
                hover:brightness-110
              "
              onClick={onSubmit}
            >
              {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}<span>Login</span>
            </button>

            {/* Admin Login */}
            <div className="flex justify-center h-9 mb-4">
              <button
                type="button"
                className="
                  border
                  rounded-lg
                  flex
                  items-center
                  gap-2
                  px-2
                  text-(--green)
                  font-semibold
                  hover:cursor-pointer
                  transition-all
                  duration-200
                  hover:bg-(--green)
                  hover:text-white
                "
                onClick={(event) => {
                  event.preventDefault();
                  setAdminAuth({ state: true, page: "login" });
                  setUserAuth({ state: false, page: "" });
                }}
              >
                <ShieldCheckIcon size={24} />
                Admin Login
                <ArrowRightIcon size={24} />
              </button>
            </div>
          </form>
        ) : (
          /* ============= SIGNUP FORM ============ */

          <form className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex border rounded-lg px-2 py-1">
              <UserIcon size={24} className="text-(--orange)" />

              <input
                type="text"
                placeholder="Name"
                name="name"
                id="name"
                value={signupData.name}
                onChange={onSignupChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Phone */}
            <div className="flex border rounded-lg px-2 py-1">
              <PhoneIcon size={24} className="text-(--orange)" />

              <input
                type="tel"
                placeholder="Phone No"
                name="phone_number"
                id="phone_number"
                value={signupData.phone_number}
                onChange={onSignupChange}
                maxLength={10}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Email */}
            <div className="flex border rounded-lg px-2 py-1">
              <EnvelopeIcon size={24} className="text-(--orange)" />

              <input
                type="email"
                placeholder="Email"
                name="email"
                id="signup-email"
                value={signupData.email}
                onChange={onSignupChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Code */}
            <div className="flex border rounded-lg px-2 py-1">
              <CodeIcon size={24} className="text-(--orange)" />

              <input
                type="text"
                placeholder="Code"
                name="code"
                id="code"
                value={signupData.code}
                onChange={onSignupChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Password */}
            <div className="flex border rounded-lg px-2 py-1">
              <LockIcon size={24} className="text-(--orange)" />

              <input
                type={viewPw ? "text" : "password"}
                placeholder="Create a password"
                name="password"
                id="signup-password"
                value={signupData.password}
                onChange={onSignupChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />

              {viewPw ? (
                <EyeSlashIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--orange)"
                  onClick={changeViewPw}
                />
              ) : (
                <EyeIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--orange)"
                  onClick={changeViewPw}
                />
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex border rounded-lg px-2 py-1">
              <LockIcon size={24} className="text-(--orange)" />

              <input
                type={viewCPw ? "text" : "password"}
                placeholder="Confirm password"
                name="c_password"
                id="c_password"
                value={signupData.c_password}
                onChange={onSignupChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />

              {viewCPw ? (
                <EyeSlashIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--orange)"
                  onClick={changeViewCPw}
                />
              ) : (
                <EyeIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--orange)"
                  onClick={changeViewCPw}
                />
              )}
            </div>

            {/* OTP */}
            <div className="w-full h-8.5 flex flex-row gap-4">
              <input
                type="text"
                placeholder="OTP"
                name="otp"
                id="otp"
                value={signupData.otp}
                onChange={onSignupChange}
                className="
                  min-w-0
                  flex-1
                  border
                  rounded-lg
                  px-2
                  py-2
                  focus:outline-none
                  focus:ring-0
                "
              />

              <button
                type="button"
                className="
                  shrink-0
                  border
                  rounded-lg
                  px-6
                  hover:cursor-pointer
                  transition-all
                  duration-200
                  hover:bg-(--orange)
                  hover:text-white
                  hover:shadow-md
                  active:scale-95
                "
                onClick={(event) => event.preventDefault()}
              >
                Generate
              </button>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="
                flex
                gap-6
                items-center
                justify-center
                font-semibold
                border
                rounded-lg
                w-full
                h-10
                hover:cursor-pointer
                bg-[linear-gradient(90deg,#A9701E_0%,#C2872E_100%)]
                text-white
                transition-all
                duration-300
                hover:shadow-[0_0_20px_rgba(194,135,46,0.5)]
                hover:brightness-110
              "
              onClick={onSubmit}
            >
              {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}<span>Sign Up</span>
            </button>

            {/* Admin Sign Up */}
            <div className="flex justify-center h-9 mb-4">
              <button
                type="button"
                className="
                  border
                  rounded-lg
                  flex
                  items-center
                  gap-2
                  px-2
                  text-(--green)
                  font-semibold
                  hover:cursor-pointer
                  transition-all
                  duration-200
                  hover:bg-(--green)
                  hover:text-white
                "
                onClick={(event) => {
                  event.preventDefault();
                  setAdminAuth({ state: true, page: "signup" });
                  setUserAuth({ state: false, page: "" });
                }}
              >
                <ShieldCheckIcon size={24} />
                Admin Sign Up
                <ArrowRightIcon size={24} />
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
