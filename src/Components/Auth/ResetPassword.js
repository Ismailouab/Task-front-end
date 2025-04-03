import React, { useState } from "react";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [token, setToken] = useState(""); // Get from API response (for testing)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        try {
            const response = await api.post("/reset-password", {
                token,
                email,
                password,
                password_confirmation
            });
            setMessage(response.data.message);
            navigate("/SignIn"); // Redirect to login after success
        } catch (error) {
            setMessage("Error: Unable to reset password.");
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input
                type="text"
                placeholder="Enter reset token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <button onClick={handleResetPassword}>Reset Password</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
