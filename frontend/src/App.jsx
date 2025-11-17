import { Routes, Route, useLocation } from "react-router-dom";

import Profile from "./pages/Profile/Profile";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";

import Navbar from "./components/Navbar";

import Transportation from "./pages/Activities/Transportation";
import Electricity from "./pages/Activities/Electricity";
import Food from "./pages/Activities/Food";
import Lifestyle from "./pages/Activities/Lifestyle";

function App() {
  const location = useLocation();

  // Hide navbar on authentication pages
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className="p-6">
        <Routes>

        <Route path="/profile" element={<Profile />} />

          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Activities */}
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/electricity" element={<Electricity />} />
          <Route path="/food" element={<Food />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
