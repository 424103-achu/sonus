import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Home from "../pages/app_pages/home_page";
import Login from "../pages/auth_pages/Login_page";
import Signup from "../pages/auth_pages/signup_page";
import Profile from "../pages/app_pages/profile_page";
import Home_Auth from "../pages/auth_pages/Home_page";
import StoryPage from "../pages/app_pages/story_page";
import HomeViewPage from "../pages/app_pages/home_view_page";
import ChatPage from "../pages/app_pages/chat_page";
import NotFoundPage from "../pages/error/NotFoundPage";
import ServerErrorPage from "../pages/error/ServerErrorPage";
import UnauthorizedPage from "../pages/error/UnauthorizedPage";

function AppRoutes() {
  return (
    <Routes>

      {/* Auth landing */}
      <Route path="/" element={<Home_Auth />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Main app - Protected */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/view-home/:id" element={<ProtectedRoute><HomeViewPage /></ProtectedRoute>} />

      {/* dynamic story route - Protected */}
      <Route path="/story/:userId/:storyId" element={<ProtectedRoute><StoryPage /></ProtectedRoute>} />

      {/* Error Pages */}
      <Route path="/error/401" element={<UnauthorizedPage />} />
      <Route path="/error/500" element={<ServerErrorPage />} />
      <Route path="/error/404" element={<NotFoundPage />} />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}

export default AppRoutes;