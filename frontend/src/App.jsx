import UserAuth from "./components/UserAuth";
import AdminAuth from "./components/AdminAuth";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Post from "./components/Post";
import Profile from "./components/Profile";
import PageNotFound from "./components/PageNotFound";

function App() {
  const [userAuth, setUserAuth] = useState({
    state: false,
    page: "signup",
  });
  const [adminAuth, setAdminAuth] = useState({
    state: false,
    page: "signup",
  });

  return (
    <>
      <BrowserRouter>
        {!adminAuth.state && userAuth.state && (
          <UserAuth
            setUserAuth={setUserAuth}
            userAuth={userAuth}
            setAdminAuth={setAdminAuth}
            adminAuth={adminAuth}
          />
        )}
        {adminAuth.state && !userAuth.state && (
          <AdminAuth
            setUserAuth={setUserAuth}
            userAuth={userAuth}
            setAdminAuth={setAdminAuth}
            adminAuth={adminAuth}
          />
        )}
        <Navbar setUserAuth={setUserAuth}/>

        <Routes>
          <Route path={"/dashboard"} element={<Dashboard />}></Route>
          <Route path={"/post/report_lost_items"} element={<Post />}></Route>
          <Route path={"/post/report_found_items"} element={<Post />}></Route>
          <Route path={"/profile"} element={<Profile setUserAuth={setUserAuth}/>}></Route>
          <Route path={"*"} element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
