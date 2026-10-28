import UserAuth from "./components/UserAuth";
import AdminAuth from "./components/AdminAuth";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Post from "./components/Post";
import Profile from "./components/Profile";
import PageNotFound from "./components/PageNotFound";
import Alert from "./components/Alert";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUserContext } from "./contexts/UserRoleContext";
import { getOrganizationDetails, getUsers } from "./api/AdminApi";
import ForgotPassword from "./components/ForgotPassword";
import ItemDetails from "./components/ItemDetails";
import { getFoundData, getLostData } from "./api/searchApi";
import ClaimRequests from "./components/ClaimRequests";
import { getUserDetails, getLostItems, getFoundItems } from "./api/ProfileApi";
import { claimAllTheDetails } from "./api/ClaimAPI";
import { details } from "./api/ClaimAPI";

// HttpOnly + Secure + SameSite cookie
// what is it
function App() {
  const [username, setUsername] = useState('')
  const { userRole, setUserRole } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [forgotPwd, setForgotPwd] = useState({ state: false, role: "" });
  const [userAuth, setUserAuth] = useState({
    state: false,
    page: "signup",
  });
  const [adminAuth, setAdminAuth] = useState({
    state: false,
    page: "signup",
  });
  const [alert, setAlert] = useState({
    msg: "",
    state: false,
  });
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone_number: "",
    code: "",
  });
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState("");
  const [organization, setOrganization] = useState({
    name: "",
    code: "",
    email: "",
    users: "",
  });
  const [users, setUsers] = useState([]);
  const [claimDetail, setClaimDetail] = useState({})

  // function that checks if the toke is expired or not
  function isTokenValid(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // this checks of the token present in browser cookie
  let tokenAvailable = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${userRole}_jwt=`))
    ?.split("=")[1];
  const [isLog, setIsLog] = useState(
    tokenAvailable ? isTokenValid(tokenAvailable) : false,
  );

  const [activePost, setActivePost] = useState("lost");
  const [changeInPost, setChangeInPost] = useState(false);

  // to display alert box
  useEffect(() => {
    const id = setTimeout(() => {
      setAlert({ msg: "", state: false });
    }, 4000);
    return () => {
      clearTimeout(id);
    };
  }, [alert]);

  // fetching the user details for the profile section in advance
  useEffect(() => {
    const userDetails = async () => {
      const data = await getUserDetails();
      setUserData({
        name: data.Name,
        email: data.Email,
        phone_number: data.Phone_Number,
        code: data.Code,
      });
      setUsername(data.Name)
    };

    // fetching the lost and found reported items
    const loadItems = async () => {
      setItemsLoading(true);
      setItemsError("");

      try {
        const [lost, found] = await Promise.all([
          getLostItems(),
          getFoundItems(),
        ]);

        setLostItems(Array.isArray(lost) ? lost : []);
        setFoundItems(Array.isArray(found) ? found : []);
      } catch (err) {
        console.error("Error loading items:", err);
        setItemsError(err.message || "Failed to load items.");
      } finally {
        setItemsLoading(false);
      }
    };

    // fetching the details of admin
    const organizationDetails = async () => {
      const data = await getOrganizationDetails();
      setOrganization({
        name: data.Name,
        code: data.Code,
        email: data.Email,
        users: data.Users,
      });
      setUsername(data.Name)
    };
    const getUsersDetails = async () => {
      const data = await getUsers();
      const formattedUsers = data.map((user) => ({
        u_id: user.U_id,
        name: user.Name,
        email: user.Email,
        phone: user.Phone_Number,
      }));
      setUsers(formattedUsers);
    };
    if (isLog && userRole === "user") {
      userDetails();
      loadItems();
    }
    if (isLog && userRole === "admin") {
      organizationDetails();
      getUsersDetails();
    }
  }, [isLog, userRole]);

  // getting the cookie if there in starting only
  useEffect(() => {
    const getCookie = (name) => {
      return document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${name}=`))
        ?.split("=")
        .slice(1)
        .join("=");
    };

    const userToken = getCookie("user_jwt");
    const adminToken = getCookie("admin_jwt");

    if (adminToken) {
      setUserRole("admin");
      setIsLog(true);
    } else if (userToken) {
      setUserRole("user");
      setIsLog(true);
    } else {
      setUserRole("");
      setIsLog(false);
    }
  }, []);


  const [retrievedData, setRetrivedData] = useState({
    foundData: [],
    lostData: [],
  });
  useEffect(() => {
    console.log("entered");
    if (!isLog) return;
    console.log("started");
    const exe = async () => {
      try {
        setLoading(true);
        let [lostData, foundData] = await Promise.all([
          getLostData(),
          getFoundData(),
        ]);
        console.log("fetched");
        console.log(lostData, foundData);
        lostData = lostData.map((ele) => ({
          item_name: ele[0],
          location: ele[2],
          description: ele[1],
          date: ele[3],
          image: ele[4],
          l_id: ele[5],
          u_id: ele[6],
          phone_no: ele[7]
        }));
        foundData = foundData.map((ele) => ({
          item_name: ele[0],
          location: ele[2],
          description: ele[1],
          date: ele[3],
          image: ele[4],
          f_id: ele[5],
          u_id: ele[6],
          phone_no: ele[7]
        }));

        setRetrivedData({
          foundData: [...foundData],
          lostData: [...lostData],
        });
        console.log('Retrieved data: ', retrievedData);
        console.log("ended");
      } catch (err) {
        setAlert({ msg: "Failed to retrieve the items details.", state: true });
      } finally {
        setLoading(false);
        setChangeInPost(false);
      }
    };
    exe();
  }, [isLog, changeInPost]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUserDetails();

        setUserData({
          name: data.Name,
          email: data.Email,
          phone_number: data.Phone_Number,
          code: data.Code,
        });
      } catch (err) {
        console.error("User details error:", err);
      }
    };

    const loadItems = async () => {
      setItemsLoading(true);
      setItemsError("");

      try {
        const [lost, found] = await Promise.all([
          getLostItems(),
          getFoundItems(),
        ]);

        setLostItems(Array.isArray(lost) ? lost : []);
        setFoundItems(Array.isArray(found) ? found : []);
      } catch (err) {
        console.error("Items loading error:", err);
        setItemsError(err.message || "Failed to load items.");
      } finally {
        setItemsLoading(false);
      }
    };

    const loadOrganizationData = async () => {
      try {
        const data = await getOrganizationDetails();

        setOrganization({
          name: data.Name,
          code: data.Code,
          email: data.Email,
          users: data.Users,
        });

        const usersData = await getUsers();
        setUsers(
          usersData.map((user) => ({
            u_id: user.U_id,
            name: user.Name,
            email: user.Email,
            phone: user.Phone_Number,
          })),
        );
      } catch (err) {
        console.error("Admin data loading error:", err);
      }
    };

    const claimDetails = async () => {
      try {
        const data = await details()
        console.log(data)
        setClaimDetail(data)

      } catch (err) {
        console.error("Claim data loading error:", err);
      }
    }

    if (!isLog || !userRole) return;

    if (userRole === "user") {
      loadUserData();
      loadItems();
      claimDetails()
    } else if (userRole === "admin") {
      loadOrganizationData();
    }
  }, [isLog, userRole]);

  // fetching the profile details
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone_number: "",
    code: "",
  });
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserDetails();

        const user = {
          name: data.Name,
          email: data.Email,
          phone_number: data.Phone_Number,
          code: data.Code ?? "",
        };
        setUserData(user);
        setEditData(user);
      } catch (err) {
        setError(err.message);
      }
    };

    loadProfile();
  }, [setUserData]);

  const [claimAllDetails, setClaimAllDetails] = useState([])
  useEffect(() => {
    const exe = async () => {
      try {
        let response = await claimAllTheDetails()
        setClaimAllDetails(response)
      } catch(err) {
        setAlert({msg: err.message, state: true})
      }
    }
    exe()
  }, [])

  useEffect(() => {
    console.log('claimalldetails: ', claimAllDetails)
  }, [claimAllDetails])

  return (
    <>
      {alert.state && <Alert msg={alert.msg} />}
      <BrowserRouter>
        {forgotPwd.state ? (
          forgotPwd.state && (
            <ForgotPassword
              setForgotPwd={setForgotPwd}
              loading={loading}
              setLoading={setLoading}
              setAlert={setAlert}
              forgotPwd={forgotPwd}
              setUserAuth={setUserAuth}
              setAdminAuth={setAdminAuth}
            />
          )
        ) : (
          <>
            {!adminAuth.state && userAuth.state && (
              <UserAuth
                setUserAuth={setUserAuth}
                userAuth={userAuth}
                setAdminAuth={setAdminAuth}
                adminAuth={adminAuth}
                setAlert={setAlert}
                alert={alert}
                loading={loading}
                setLoading={setLoading}
                setIsLog={setIsLog}
                userRole={userRole}
                setUserRole={setUserRole}
                setForgotPwd={setForgotPwd}
              />
            )}
            {adminAuth.state && !userAuth.state && (
              <AdminAuth
                setUserAuth={setUserAuth}
                userAuth={userAuth}
                setAdminAuth={setAdminAuth}
                adminAuth={adminAuth}
                setAlert={setAlert}
                alert={alert}
                loading={loading}
                setLoading={setLoading}
                setIsLog={setIsLog}
                userRole={userRole}
                setUserRole={setUserRole}
                setForgotPwd={setForgotPwd}
              />
            )}
          </>
        )}

        <Navbar
          setUserAuth={setUserAuth}
          isLog={isLog}
          setIsLog={setIsLog}
          setAlert={setAlert}
          userRole={userRole}
          username={username}
        />

        <Routes>
          <Route
            path={"/dashboard"}
            element={
              <Dashboard
                organization={organization}
                setOrganization={setOrganization}
                users={users}
                setUsers={setUsers}
                isLog={isLog}
                setUserAuth={setUserAuth}
                userRole={userRole}
                setAlert={setAlert}
                loading={loading}
                setLoading={setLoading}
                retrievedData={retrievedData}
                setChangeInPost={setChangeInPost}
              />
            }
          ></Route>
          <Route
            path={"/"}
            element={
              <Dashboard
                organization={organization}
                setOrganization={setOrganization}
                users={users}
                setUsers={setUsers}
                isLog={isLog}
                setUserAuth={setUserAuth}
                userRole={userRole}
                setAlert={setAlert}
                loading={loading}
                setLoading={setLoading}
                retrievedData={retrievedData}
                setChangeInPost={setChangeInPost}
              />
            }
          ></Route>
          <Route
            path={"/post/report_lost_items"}
            element={
              <ProtectedRoute
                setIsLog={setIsLog}
                setAlert={setAlert}
                setUserAuth={setUserAuth}
              >
                <Post
                  setActivePost={setActivePost}
                  activePost="lost"
                  loading={loading}
                  setLoading={setLoading}
                  setAlert={setAlert}
                  setChangeInPost={setChangeInPost}
                />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path={"/post/report_found_items"}
            element={
              <ProtectedRoute
                setIsLog={setIsLog}
                setAlert={setAlert}
                setUserAuth={setUserAuth}
              >
                <Post
                  setActivePost={setActivePost}
                  activePost="found"
                  loading={loading}
                  setLoading={setLoading}
                  setAlert={setAlert}
                  setChangeInPost={setChangeInPost}
                />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path={"/profile"}
            element={
              <ProtectedRoute
                setIsLog={setIsLog}
                setAlert={setAlert}
                setUserAuth={setUserAuth}
              >
                <Profile
                  userData={userData}
                  setUserData={setUserData}
                  lostItems={lostItems}
                  foundItems={foundItems}
                  itemsLoading={itemsLoading}
                  itemsError={itemsError}
                  editData={editData}
                  setEditData={setEditData}
                  setAlert={setAlert}
                  claimAllDetails={claimAllDetails}
                  setClaimAllDetails={setClaimAllDetails}
                />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/item-details" element={<ItemDetails lostItems={lostItems} setAlert={setAlert} loading={loading} setLoading={setLoading} />} />
          <Route path="/claim-requests" element={<ClaimRequests />} />
          <Route
            path={"*"}
            element={<PageNotFound setUserAuth={setUserAuth} />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
