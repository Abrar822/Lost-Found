import {
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  EnvelopeIcon,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { updatePassword } from "../api/AuthApi";
import { generateOtp } from "../api/AuthApi";
import "../App.css"

export default function ForgotPassword({
  setForgotPwd,
  loading,
  setLoading,
  setAlert,
  forgotPwd,
  setUserAuth,
  setAdminAuth,
}) {
  const [details, setDetails] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
    role: "",
    otp: "",
  });
  const [otpLoading, setOtpLoading] = useState(false)

  useEffect(() => {
    setDetails((prev) => ({ ...prev, role: forgotPwd.role }));
  }, [forgotPwd]);

  const [viewPw, setViewPw] = useState(false);
  const [viewCPw, setViewCPw] = useState(false);

  const insertDetails = (e) => {
    setDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetThePassword = async (e) => {
    try {
      e.preventDefault();
      if (
        details.email === "" ||
        details.new_password === "" ||
        details.otp === ""
      ) {
        setAlert({ msg: "All the details must be filled.", state: true });
        return;
      }
      if (
        details.new_password !== details.confirm_password &&
        details.new_password !== ""
      ) {
        setAlert({ msg: "Passwords do not match.", state: true });
        return;
      }

      setLoading(true);
      let response = await updatePassword({
        email: details.email,
        new_password: details.new_password,
        role: details.role,
        otp: details.otp,
      });
      if (response) {
        setAlert({ msg: response.message, state: true });
      }
      setDetails({
        email: "",
        new_password: "",
        confirm_password: "",
        role: "",
        otp: "",
      });
      if (forgotPwd.role === "user") {
        setUserAuth({ state: true, page: "login" });
      } else if (forgotPwd.role === "admin") {
        setAdminAuth({ state: true, page: "login" });
      }
      setForgotPwd({ state: false, role: "" });
    } catch (err) {
      setAlert({ msg: err.message, state: true });
    } finally {
      setLoading(false);
    }
  };

  const genOtp = async () => {
    if (details.email === "") {
      setAlert({ msg: "Please enter the email.", state: true });
      return;
    }
    try {
      setOtpLoading(true);
      let response = await generateOtp(details.email);
      if (response) {
        setAlert({ msg: response.message, state: true });
      }
    } catch (err) {
      setAlert({ msg: err.message, state: true });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="overlay absolute inset-0 bg-black/60 z-1"
        onClick={() => setForgotPwd({ state: false, role: "" })}
      ></div>

      {/* Forgot Password Container */}
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
          py-5
        "
      >
        <h2 className="text-2xl font-semibold text-(--text-1)">
          Reset Password
        </h2>

        <form className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex border rounded-lg px-2 py-1">
            <EnvelopeIcon
              size={24}
              className={`text-(--${forgotPwd.role === "user" ? "orange" : "green"})`}
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              id="reset-email"
              value={details.email}
              onChange={insertDetails}
              className="w-70 px-2 focus:outline-none focus:ring-0"
            />
          </div>

          {/* New Password */}
          <div className="flex border rounded-lg px-2 py-1">
            <LockIcon
              size={24}
              className={`text-(--${forgotPwd.role === "user" ? "orange" : "green"})`}
            />

            <input
              type={viewPw ? "text" : "password"}
              placeholder="New Password"
              name="new_password"
              id="new-password"
              value={details.new_password}
              onChange={insertDetails}
              className="w-70 px-2 focus:outline-none focus:ring-0"
            />

            <button
              type="button"
              onClick={() => setViewPw((prev) => !prev)}
              className={`text-(--${forgotPwd.role === "user" ? "orange" : "green"}) cursor-pointer`}
              aria-label={viewPw ? "Hide new password" : "Show new password"}
            >
              {viewPw ? <EyeSlashIcon size={24} /> : <EyeIcon size={24} />}
            </button>
          </div>

          {/* Confirm New Password */}
          <div className="flex border rounded-lg px-2 py-1">
            <LockIcon
              size={24}
              className={`text-(--${forgotPwd.role === "user" ? "orange" : "green"})`}
            />

            <input
              type={viewCPw ? "text" : "password"}
              placeholder="Confirm New Password"
              name="confirm_password"
              id="confirm-password"
              value={details.confirm_password}
              onChange={insertDetails}
              className="w-70 px-2 focus:outline-none focus:ring-0"
            />

            <button
              type="button"
              onClick={() => setViewCPw((prev) => !prev)}
              className={`text-(--${forgotPwd.role === "user" ? "orange" : "green"}) cursor-pointer`}
              aria-label={
                viewCPw ? "Hide confirm password" : "Show confirm password"
              }
            >
              {viewCPw ? <EyeSlashIcon size={24} /> : <EyeIcon size={24} />}
            </button>
          </div>

          <div className="w-full h-8.5 flex flex-row gap-4">
            <input
              type="text"
              placeholder="OTP"
              name="otp"
              id="otp"
              value={details.otp}
              onChange={insertDetails}
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
              className={`
                  group
                  shrink-0
                  border
                  rounded-lg
                  px-6
                  hover:cursor-pointer
                  transition-all
                  duration-200
                  hover:bg-(--${forgotPwd.role === "user" ? "orange" : "green"})
                  hover:text-white
                  hover:shadow-md
                  active:scale-95
                  flex
                  items-center
                  justify-center
                `}
              onClick={genOtp}
            >
              {!otpLoading ? <span>Generate</span> : <span
  className={`otp-spinner ${
    forgotPwd.role === "user" ? "user-spinner" : "admin-spinner"
  }`}
/>}
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={resetThePassword}
            name="submit-btn"
            type="submit"
            disabled={loading}
            className={`
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
              bg-${forgotPwd.role === "user" ? "[linear-gradient(90deg,#A9701E_0%,#C2872E_100%)]" : "[linear-gradient(90deg,#255A4F_0%,#2F6F62_100%)]"}
              text-white
              transition-all
              duration-300
              hover:shadow-[0_0_20px_rgba(194,135,46,0.5)]
              hover:brightness-110
              disabled:opacity-60
              disabled:cursor-not-allowed
            `}
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            <span>Submit</span>
          </button>

          {/* Back to Login */}
          <div className="flex justify-center h-9 mb-4">
            <button
              type="button"
              onClick={() => setForgotPwd({ state: false, role: "" })}
              className={`
                border
                rounded-lg
                flex
                items-center
                gap-2
                px-2
                text-(--${forgotPwd.role === "user" ? "orange" : "green"})
                font-semibold
                hover:cursor-pointer
                transition-all
                duration-200
                hover:bg-(--${forgotPwd.role === "user" ? "orange" : "green"})
                hover:text-white
              `}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
