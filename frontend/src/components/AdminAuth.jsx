import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  EnvelopeIcon,
  UserIcon,
  CodeIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { adminLogin, adminSignup } from "../api/AuthApi";

export default function AdminAuth({
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
    organization_name: "",
    email: "",
    code: "",
    password: "",
    c_password: "",
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

    if (adminAuth.page === "login") {
      if (loginData.password === "" || loginData.email === "") {
        setAlert({ msg: "All the details must be filled.", state: true });
        return;
      }
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email);
      if(!isEmailValid) {
        setAlert({msg: 'Enter a valid email.', state: true})
        return;
      }
      try {
        setLoading(true)
        let response = await adminLogin(loginData);
        if(response) {
          setAlert({msg: 'Login Successful.', state: true})
          let token = response.access_token
          document.cookie = `admin_jwt=${token};path=/;`
          setAdminAuth({state: false, page: ''})
          setIsLog(true)
        }
        setLoading(false)
      } catch (err) {
        setAlert({ msg: "Login Failed. " + String(err.message), state: true });
      } finally {
        setLoading(false)
      }
    } else if (adminAuth.page == "signup") {
      if (
        signupData.password === "" ||
        signupData.c_password === "" ||
        signupData.code === "" ||
        signupData.email === "" ||
      signupData.organization_name === '') {
        setAlert({ msg: "All the details must be filled.", state: true });
        return;
      }
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email);
      if(!isEmailValid) {
        setAlert({msg: 'Enter a valid email.', state: true})
        return
      }
      try {
        if (signupData.password !== signupData.c_password) {
          setAlert({ msg: "Passwords do not match.", state: true });
          return;
        }
        setLoading(true)
        let response = await adminSignup(signupData);
        if (response) {
          setAlert({msg: 'Signup Successful.', state: true})
          setAdminAuth({
            state: true,
            page: "login",
          });
        }
      } catch (err) {
        setAlert({ msg: "Signup Failed. " + String(err.message), state: true });
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
          setAdminAuth({ state: false, page: "" });
        }}
      ></div>
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
        <div className="relative flex w-55 h-10 mt-4 overflow-hidden rounded-lg border">
          {/* Active Sign Up Background */}
          {adminAuth.page === "signup" && (
            <div
              className="absolute inset-0 bg-(--bg) z-0"
              style={{
                clipPath: "polygon(0 0, 53% 0, 47% 100%, 0 100%)",
              }}
            />
          )}

          {/* Active Login Background */}
          {adminAuth.page === "login" && (
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
              setAdminAuth({ state: true, page: "signup" });
              setUserAuth({ state: false, page: "" });
            }}
            className={`relative z-10 flex-1 h-full text-2xl font-semibold
        ${adminAuth.page === "signup" ? "text-(--dark-green)" : ""}`}
          >
            Sign Up
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => {
              setAdminAuth({ state: true, page: "login" });
              setUserAuth({ state: false, page: "" });
            }}
            className={`relative z-10 flex-1 h-full text-2xl font-semibold
        ${adminAuth.page === "login" ? "text-(--dark-green)" : ""}`}
          >
            Login
          </button>

          {/* Diagonal Separator */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2
        h-[calc(100%+16px)] w-px
        -translate-x-1/2 -translate-y-1/2 rotate-20
        bg-black z-20"
          />
        </div>

        <div>
          {/* <UserRound size={80} strokeWidth={1} className="text-white"/> */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="bg-[linear-gradient(90deg,#255A4F_0%,#2F6F62_100%)] rounded-full"
          >
            {/* <defs>
                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#F33FB5"/>
                        <stop offset="50%" stop-color="#C08CDD"/>
                        <stop offset="100%" stop-color="#F09BC0"/>
                        </linearGradient>
                    </defs> */}

            <circle cx="100" cy="100" r="98" fill="url(#bgGradient)" />
            <circle cx="100" cy="80" r="28" fill="#FFFFFF" fill-opacity="0.9" />

            <path
              d="M 50 165
                            C 50 125 72 108 100 108
                            C 128 108 150 125 150 165
                            Z"
              fill="#FFFFFF"
              fill-opacity="0.9"
            />

            <clipPath id="circleClip">
              <circle cx="100" cy="100" r="98" />
            </clipPath>
          </svg>
        </div>
        {adminAuth.page === "login" ? (
          <form className="flex flex-col gap-4">
            <div className="flex border rounded-lg px-2 py-1">
              {/* <Mail /> */}
              <EnvelopeIcon size={24} className="text-(--green)" />
              <input
                type="text"
                placeholder="Email"
                name="email"
                id="email"
                value={loginData.email}
                onChange={onLoginChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="flex border rounded-lg px-2 py-1">
              <LockIcon size={24} className="text-(--green)" />
              <input
                type={viewPw ? "text" : "password"}
                placeholder="Password"
                name="password"
                id="password"
                value={loginData.password}
                onChange={onLoginChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
              {viewPw ? (
                <EyeSlashIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--green)"
                  onClick={changeViewPw}
                />
              ) : (
                <EyeIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--green)"
                  onClick={changeViewPw}
                />
              )}
            </div>

            <button
              className="flex gap-6 items-center justify-center font-semibold border rounded-lg w-full h-10 hover:cursor-pointer bg-[linear-gradient(90deg,#255A4F_0%,#2F6F62_100%)] text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(47,111,98,0.5)] hover:brightness-110"
              onClick={onSubmit}
            >
              {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>} <span>Login</span>
            </button>

            <div className="flex justify-center h-9 mb-4 ">
              <button
                className="border rounded-lg flex items-center gap-2 px-2 text-(--orange) font-semibold hover:cursor-pointer transition-all duration-200 hover:bg-(--orange) hover:text-white"
                onClick={(event) => {
                  event.preventDefault();
                  setUserAuth({ state: true, page: "login" });
                  setAdminAuth({ state: false, page: "" });
                }}
              >
                <ArrowLeftIcon size={24} />
                User Login
              </button>
            </div>
          </form>
        ) : (
          <form className="flex flex-col gap-4">
            {/* <label htmlFor="name">Name: </label>
                <br /> */}
            <div className="flex border rounded-lg px-2 py-1">
              <UserIcon size={24} className="text-(--green)" />
              <input
                type="text"
                placeholder="Organization Name"
                name="organization_name"
                id="organization_name"
                value={signupData.organization_name}
                onChange={onSignupChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>

            {/* <label htmlFor="email">Email: </label>
                <br /> */}
            <div className="flex border rounded-lg px-2 py-1">
              {/* <Mail /> */}
              <EnvelopeIcon size={24} className="text-(--green)" />
              <input
                type="text"
                placeholder="Email"
                name="email"
                id="email"
                value={signupData.email}
                onChange={onSignupChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>

            {/* <label htmlFor="code">Code: </label>
                <br /> */}
            <div className="flex border rounded-lg px-2 py-1">
              <CodeIcon size={24} className="text-(--green)" />
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

            {/* <label htmlFor="password">Password: </label>
                <br/> */}
            <div className="flex border rounded-lg px-2 py-1">
              {/* <LockKeyhole /> */}
              <LockIcon size={24} className="text-(--green)" />
              <input
                type={viewPw ? "text" : "password"}
                placeholder="Create a password"
                name="password"
                id="password"
                value={signupData.password}
                onChange={onSignupChange}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
              {viewPw ? (
                <EyeSlashIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--green)"
                  onClick={changeViewPw}
                />
              ) : (
                <EyeIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--green)"
                  onClick={changeViewPw}
                />
              )}
            </div>

            {/* <label htmlFor="c_password">Confirm Password: </label>
                <br/> */}
            <div className="flex border rounded-lg px-2 py-1">
              {/* <LockKeyhole /> */}
              <LockIcon size={24} className="text-(--green)" />
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
                  className="hover:cursor-pointer text-(--green)"
                  onClick={changeViewCPw}
                />
              ) : (
                <EyeIcon
                  size={24}
                  strokeWidth={2}
                  className="hover:cursor-pointer text-(--green)"
                  onClick={changeViewCPw}
                />
              )}
            </div>

            <button
              className="flex gap-6 items-center justify-center font-semibold border rounded-lg w-full h-10 hover:cursor-pointer bg-[linear-gradient(90deg,#255A4F_0%,#2F6F62_100%)] text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(47,111,98,0.5)] hover:brightness-110"
              onClick={onSubmit}
            >
              {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}<span>Sign Up</span>
            </button>

            <div className="flex justify-center h-9 mb-4 ">
              <button
                className="border rounded-lg flex items-center gap-2 px-2 text-(--orange) font-semibold hover:cursor-pointer transition-all duration-200 hover:bg-(--orange) hover:text-white"
                onClick={(event) => {
                  event.preventDefault();
                  setUserAuth({ state: true, page: "signup" });
                  setAdminAuth({ state: false, page: "" });
                }}
              >
                <ArrowLeftIcon size={24} />
                User Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
