import { Routes, Route } from "react-router-dom";
import Home from "../pages/app_pages/home_page";
import Login from "../pages/auth_pages/Login_page";
import Signup from "../pages/auth_pages/signup_page";
import Profile from "../pages/app_pages/profile_page";
import Home_Auth from "../pages/auth_pages/Home_page";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home_Auth/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/home" element={<Home/>}/>
    </Routes>
  );
}

export default AppRoutes;
