
import { Routes, Route, Navigate } from "react-router-dom";
import { userAuthStore } from "./store/userAuthStore";

import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";

import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Navebar from "./components/Navebar";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = userAuthStore();



  useEffect(() => {
   
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );


  return (
    <div>
      <Navebar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
};
export default App;
