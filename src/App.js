import SignIn from "./Components/Auth/SignIn";
import SignUp from "./Components/Auth/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react'
import Dashboard from "./Components/Dashboard/Dashboard";
import Teams from "./Components/Teams/Teams";
import Tasks from "./Components/Tasks/Tasks";
import Projects from "./Components/Projects/Projects";
import Profile from "./Components/Profile/Profile";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";

function App() {
  return (
    <>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/Projects" element={<Projects />} />
              <Route path="/Tasks" element={<Tasks />} />
              <Route path="/Teams" element={<Teams />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/ResetPassword" element={<ResetPassword />} />

            </Route>
          </Route>


        </Routes>
      </Router>




    </>
  );
}

export default App;
