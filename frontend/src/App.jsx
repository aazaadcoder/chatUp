import React, { useEffect } from "react";
import NavBar from "./Components/NavBar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import LogInPage from "./Pages/LogInPage.jsx";
import SettingsPage from "./Pages/SettingsPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useThemeStore } from "./store/useThemeStore.js";
const App = () => {
  const { authUser, checkAuth, ischeckingAuth, onlineUsers, connectSocket } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();

    
  }, [checkAuth]);

  if (ischeckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LogInPage /> : <Navigate to="/" />}
        ></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        ></Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
