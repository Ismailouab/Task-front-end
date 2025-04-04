import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import "./dashboard.css"

const DashboardLayout = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Function to determine the image source
    const getProfileImageSrc = () => {
        if (!user?.profile_picture) return null;
        
        if (user.profile_picture.startsWith('http')) {
            return user.profile_picture;
        } else {
            return `${process.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${user.profile_picture}`;
        }
    };

    const profileImageSrc = getProfileImageSrc();
    const firstLetter = user?.name?.charAt(0)?.toUpperCase() || 'P'; // Default to 'P' if no name

    return (
        <div>
            <nav className="fixed-nav">
                <ul>
                    <li>
                        <Link to="/profile" className="profile-link">
                            {profileImageSrc ? (
                                <img 
                                    src={profileImageSrc} 
                                    alt="Profile" 
                                    className="profile-image"
                                />
                            ) : (
                                <div className="profile-initial">
                                    {firstLetter}
                                </div>
                            )}
                        </Link>
                    </li>
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
    );
};

export default DashboardLayout;