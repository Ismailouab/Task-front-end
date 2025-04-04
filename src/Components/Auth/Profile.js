import React, { useState } from 'react';
import api from '../Api/Api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();

    const [showUpdateProfile, setShowUpdateProfile] = useState(false);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [message, setMessage] = useState('');
    // To this (ensure profile_picture is always defined)
    const [updatedUser, setUpdatedUser] = useState({
        name: user?.name || '',
        email: user?.email || '',
        timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        profile_picture: user?.profile_picture || null
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout failed", error);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/SignIn");
    };

    const toggleUpdateProfile = () => {
        setShowUpdateProfile(!showUpdateProfile);
    };

    const toggleUpdatePassword = () => {
        setShowUpdatePassword(!showUpdatePassword);
    };

    // Mise à jour du profil
    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("name", updatedUser.name);
            formData.append("email", updatedUser.email);
            formData.append("timezone", updatedUser.timezone);
    
            // Only include profile picture if a new file was selected
            if (updatedUser.profile_picture instanceof File) {
                const base64Image = await convertToBase64(updatedUser.profile_picture);
                formData.append("profile_picture", base64Image);
            }
            // Explicitly don't send anything about profile picture if not changing it
    
            const response = await api.put("/profile", formData);
    
            // Update local state with response data
            const updatedUserData = response.data.user;
            localStorage.setItem("user", JSON.stringify(updatedUserData));
            
            // Preserve the existing picture if not changed
            setUpdatedUser({
                ...updatedUserData,
                profile_picture: updatedUserData.profile_picture || 
                               (updatedUser.profile_picture instanceof File ? null : updatedUser.profile_picture)
            });
    
            setMessage("Profile updated successfully!");
            setShowUpdateProfile(false);
        } catch (error) {
            setMessage("Update failed: " + (error.response?.data?.message || error.message));
            console.error("Update failed", error);
        }
    };

    // Helper function to convert file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleUpdatePassword = async () => {
        try {
            const response = await api.put("/password", passwordData);

            setMessage(response.data.message);
            setShowUpdatePassword(false);
            setPasswordData({ current_password: '', password: '', password_confirmation: '' }); 
        } catch (error) {
            setMessage(error.response?.data?.message || "Échec de la mise à jour du mot de passe.");
            console.error("Password update failed", error);
        }
    };

    return (
        <div>
            <div className="profile-info">
                <p><strong>Name:</strong> {user ? user.name : "User"}</p>
                <p><strong>Email:</strong> {user ? user.email : "Email"}</p>
                <p><strong>Timezone:</strong> {user ? user.timezone : "Timezone"}</p>
                {updatedUser.profile_picture && (
                    <img
                        src={
                            updatedUser.profile_picture instanceof File
                                ? URL.createObjectURL(updatedUser.profile_picture)
                                : updatedUser.profile_picture.startsWith('http')
                                    ? updatedUser.profile_picture
                                    : `${process.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${updatedUser.profile_picture}`
                        }
                        alt="Profile"
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "50%"
                        }}
                    />
                )}


                <p onClick={handleLogout} style={{ cursor: "pointer", color: "blue" }}>Logout</p>
                <p onClick={toggleUpdateProfile} style={{ cursor: "pointer", color: "green" }}>Update Profile</p>
                <p onClick={toggleUpdatePassword} style={{ cursor: "pointer", color: "red" }}>Update Password</p>
            </div>

            {showUpdateProfile && (
    <div className="update-profile">
        <input
            type="text"
            value={updatedUser.name}
            onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
            placeholder="Enter new name"
        />
        <input
            type="email"
            value={updatedUser.email}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
            placeholder="Enter new email"
        />
        <input
            type="text"
            value={updatedUser.timezone}
            onChange={(e) => setUpdatedUser({ ...updatedUser, timezone: e.target.value })}
            placeholder="Enter timezone"
        />
        <input
            type="file"
            accept="image/*"
            onChange={(e) => setUpdatedUser({ ...updatedUser, profile_picture: e.target.files[0] })}
        />
        <button onClick={handleUpdateProfile}>Save</button>
        <button onClick={toggleUpdateProfile}>Cancel</button>
    </div>
)}

            {showUpdatePassword && (
                <div className="update-password">
                    <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        placeholder="Current Password"
                    />
                    <input
                        type="password"
                        value={passwordData.password}
                        onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                        placeholder="New Password"
                    />
                    <input
                        type="password"
                        value={passwordData.password_confirmation}
                        onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                        placeholder="Confirm New Password"
                    />

                    <button onClick={handleUpdatePassword}>Save</button>
                    <button onClick={toggleUpdatePassword}>Cancel</button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default Profile;
