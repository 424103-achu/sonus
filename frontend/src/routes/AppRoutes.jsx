import { Routes, Route } from "react-router-dom";

import Home from "../pages/app_pages/home_page";
import Login from "../pages/auth_pages/Login_page";
import Signup from "../pages/auth_pages/signup_page";
import Profile from "../pages/app_pages/profile_page";
import Home_Auth from "../pages/auth_pages/Home_page";
import StoryPage from "../pages/app_pages/story_page";

function AppRoutes() {
  return (
    <Routes>

      {/* Auth landing */}
      <Route path="/" element={<Home_Auth />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Main app */}
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />

    {/* dynamic story route */}
      <Route path="/story/:userId/:storyId" element={<StoryPage />} />

    </Routes>
  );
}

export default AppRoutes;