import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home_page";
import Login from "../pages/Login_page";
import Signup from "../pages/dummy";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default AppRoutes;
