import React, { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import { userAppStore } from "./store/index.js"; // Correct import

import { GET_USER_INFO } from "./utils/constants.js";
import apiClient from "./lib/api-client";

const PrivateRoute = ({ children }) => {
  const { userInfo } = userAppStore(); // Accessing userInfo from store
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setuserInfo } = userAppStore(); // Ensure you use setuserInfo
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        console.log(response.data);
        if (response.status === 200 && response.data.id) {
          setuserInfo(response.data); // Correct usage
        } else {
          setuserInfo(undefined);
        }
      } catch (error) {
        setuserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setuserInfo]); // Make sure setuserInfo is included

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loader component
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
