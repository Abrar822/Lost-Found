import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PageNotFound({ setUserAuth }) {
  const navigate_not_found = useNavigate();
  useEffect(() => {
    setUserAuth({
      page: "login",
      state: true,
    });
  }, []);
  return (
    <>
      <div className="min-h-screen w-full flex flex-col justify-center items-center text-(--text-1) px-4">
        <h1 className="text-9xl font-extrabold text-(--orange) tracking-widest">
          404
        </h1>
        <div className="bg-(--btn-black) text-(--pure-white) px-2 text-sm rounded rotate-12 absolute mb-16">
          Page Not Found
        </div>

        <p className="text-xl font-medium mt-4 text-center max-w-md">
          The page you are looking for is not accessible without login, doesn't
          exist, has been moved, or is temporarily unavailable.
        </p>

        <button
          onClick={() => navigate_not_found("/dashboard")}
          className="mt-8 px-6 py-3 bg-(--btn-black) text-(--pure-white) font-bold rounded-lg transition-all duration-150 ease-in active:scale-95 cursor-pointer border-0 outline-0 shadow-lg hover:opacity-90"
        >
          Back to Dashboard
        </button>
      </div>
    </>
  );
}
