import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserRoleContext from "./contexts/UserRoleContext.jsx";

createRoot(document.getElementById("root")).render(
    <UserRoleContext>
        <App />
    </UserRoleContext>
);
