import { Routes, Route } from "react-router-dom";
import Home from "../pages/auth_pages/Home_page";
import Login from "../pages/auth_pages/Login_page";
import Signup from "../pages/auth_pages/signup_page";
import Profile from "../pages/app_pages/profile_page";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
  );
}

export default AppRoutes;
