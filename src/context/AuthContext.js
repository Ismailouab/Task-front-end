import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Components/Api/Api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    // Login function
    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            setUser(response.data.user);
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setMessage('Login successful!');
            setErrors([]);
            navigate('/Dashboard');
            return true;
        } catch (error) {
            console.error(error);
            setMessage('Login failed!');
            setErrors(['Invalid email or password']);
            return false;
        }
    };

    // Register function
    const register = async (name, email, password, password_confirmation) => {
        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            setMessage('Registration successful!');
            setErrors([]);
            navigate('/SignIn');
            return true;
        } catch (error) {
            console.log(error);
            setMessage('Registration failed!');
            return false;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout failed", error);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/SignIn");
    };

    // Update profile function
    const updateProfile = async (updatedData) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedData.name || '');
            formData.append('email', updatedData.email || '');
            formData.append('timezone', updatedData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

            if (updatedData.profile_picture) {
                formData.append('profile_picture', updatedData.profile_picture);
            }

            const response = await api.put("/profile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setMessage("Profile updated successfully!");
            return true;
        } catch (error) {
            setMessage("Update failed.");
            console.error("Update failed", error);
            return false;
        }
    };

    // Update password function
    const updatePassword = async (passwordData) => {
        try {
            const response = await api.put("/password", passwordData);
            setMessage(response.data.message);
            return true;
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update password.");
            console.error("Password update failed", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            message,
            errors,
            login,
            register,
            logout,
            updateProfile,
            updatePassword,
            setMessage,
            setErrors
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};