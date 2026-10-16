import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children, setIsLog, setAlert, setUserAuth }) {
  function isTokenValid(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
  const token = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("user_jwt="))
    ?.split("=")[1];

  if (!token || !isTokenValid(token)) {
    setIsLog(false)
    setAlert({msg: 'Session Expired. Please Log In again.', state: true})
    setUserAuth({page: 'login', state: true})
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
