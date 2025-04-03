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
    const [updatedUser, setUpdatedUser] = useState(user || { name: '', email: '' });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    // Déconnexion
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

    // Toggle mise à jour profil
    const toggleUpdateProfile = () => {
        setShowUpdateProfile(!showUpdateProfile);
    };

    // Toggle mise à jour mot de passe
    const toggleUpdatePassword = () => {
        setShowUpdatePassword(!showUpdatePassword);
    };

    // Mise à jour du profil
    const handleUpdateProfile = async () => {
        try {
            const response = await api.put("/profile", {
                name: updatedUser.name,
                email: updatedUser.email,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });

            setMessage("Profil mis à jour avec succès !");
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setShowUpdateProfile(false);
        } catch (error) {
            setMessage("Échec de la mise à jour.");
            console.error("Update failed", error);
        }
    };

    // Mise à jour du mot de passe
    const handleUpdatePassword = async () => {
        try {
            const response = await api.put("/password", passwordData);

            setMessage(response.data.message); // Afficher "Password updated successfully"
            setShowUpdatePassword(false);
            setPasswordData({ current_password: '', password: '', password_confirmation: '' }); // Réinitialiser les champs
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
