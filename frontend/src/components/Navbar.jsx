import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ setUserAuth, isLog, setIsLog, setAlert }) {
  const navigate = useNavigate();
  const location = useLocation();
  const logOut = () => {
    let token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("user_jwt="))
      ?.split("=")[1];
    if (token) {
      document.cookie =
        "user_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setIsLog(false);
      setAlert({ msg: "Logged Out successfully.", state: true });
      navigate('/dashboard')
    }
  };

  return (
    <>
      <div className="bg-(--navbar)/90 text-(--text-1) nav-container max-w-full w-full h-[70px] fixed z-2 top-0 border-b-1 border-(--border-1)/20">
        <nav className="nav max-w-[1600px] h-full p-2 px-4 mx-auto flex justify-between items-center">
          <div className="logo tracking-wider text-2xl font-bold">
            Lost<span className="text-(--orange)">&</span>Found
          </div>
          <ul className="menus flex gap-7 cursor-pointer">
            <li
              className={`h-[40px] text-(--text-1) font-bold rounded-lg flex justify-center items-center transition-all duration-150 ease-in-out active:scale-90`}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              <button
                className={`cursor-pointer border-0 outline-0 py-1 px-3 w-full ${location.pathname.includes("/dashboard") ? "text-(--orange)" : ""}`}
              >
                Dashboard
              </button>
            </li>
            {isLog && (
              <li
                className="h-[40px] text-(--text-1) font-bold rounded-lg flex justify-center items-center transition-all duration-150 ease-in-out active:scale-95"
                onClick={() => {
                  navigate("/post/report_lost_items");
                }}
              >
                <button
                  className={`${location.pathname.includes("/post") ? "text-(--orange)" : ""} cursor-pointer border-0 outline-0 py-1 px-3 w-full`}
                >
                  Post
                </button>
              </li>
            )}
            {!isLog && (
              <li
                className="h-[40px] text-(--text-1) font-bold rounded-lg flex justify-center items-center transition-all duration-150 ease-in-out active:scale-95"
                onClick={() => {
                  setUserAuth({ state: true, page: "login" });
                }}
              >
                <button className="cursor-pointer border-0 outline-0 py-1 px-3 w-full">
                  Log In
                </button>
              </li>
            )}
            {isLog && (
              <li
                className={`h-[40px] text-(--text-1) font-bold rounded-lg flex justify-center items-center transition-all duration-150 ease-in-out active:scale-90`}
                onClick={() => {
                  navigate("/profile");
                }}
              >
                <button
                  className={`cursor-pointer border-0 outline-0 py-1 px-3 w-full ${location.pathname.includes("/profile") ? "text-(--orange)" : ""}`}
                >
                  Profile
                </button>
              </li>
            )}
            {!isLog && (
              <li
                className="h-[40px] text-(--pure-white) bg-(--btn-black) font-bold rounded-lg flex justify-center items-center transition-all duration-150 ease-in active:scale-95 w-[90px]overflow-hidden"
                onClick={() => {
                  setUserAuth({ state: true, page: "signup" });
                }}
              >
                <button className="cursor-pointer border-0 outline-0 py-1 px-3 w-full transition-all duration-150 ease-in hover:opacity-90">
                  Sign Up
                </button>
              </li>
            )}
            {isLog && (
              <li
                className="h-[40px] text-(--pure-white) bg-(--btn-black) font-bold rounded-lg flex justify-center items-center transition-all duration-150 ease-in active:scale-95 w-[90px]overflow-hidden"
                onClick={logOut}
              >
                <button className="cursor-pointer border-0 outline-0 py-1 px-3 w-full transition-all duration-150 ease-in hover:opacity-90">
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
