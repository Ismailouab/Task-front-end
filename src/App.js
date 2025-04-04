import SignIn from "./Components/Auth/SignIn";
import SignUp from "./Components/Auth/SignUp";
import { Route, Routes } from "react-router-dom";
import React from 'react';
import Dashboard from "./Components/Dashboard/Dashboard";
import Teams from "./Components/Teams/Teams";
import Tasks from "./Components/Tasks/Tasks";
import Projects from "./Components/Projects/Projects";
import Profile from "./Components/Auth/Profile";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Routes>
        {/* Public Routes */}
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Projects" element={<Projects />} />
            <Route path="/Tasks" element={<Tasks />} />
            <Route path="/Teams" element={<Teams />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
