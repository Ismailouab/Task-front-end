import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const DashboardLayout  = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null; // Parse stored user data


  return (
    <div>
          <nav className="fixed-nav">
        <ul>
            <li><Link to="/profile"> 
            {user ? `${user.name}` : "Profile"}
            </Link></li>
          <li><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/Projects">Projects</Link></li>
          <li><Link to="/Tasks">Tasks</Link></li>
          <li><Link to="/Teams">Teams</Link></li>
        </ul>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout 
