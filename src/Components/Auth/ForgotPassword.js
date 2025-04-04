import React, { useState } from "react";
import api from "../Api/Api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleForgotPassword = async () => {
        try {
            const response = await api.post("/forgot-password", { email });
            setMessage(response.data.message);
            setShowCodeInput(true);
        } catch (error) {
            setMessage("If this email exists, a password reset code has been sent");
            console.log(error)
            // Still show code input to prevent email enumeration
            setShowCodeInput(true);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match");
            return;
        }

        try {
            const response = await api.post("/reset-password", {
                email,
                code,
                password: newPassword,
                password_confirmation: confirmPassword
            });
            setMessage(response.data.message);
            // Optionally redirect to login here
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h2>Forgot Password</h2>
            
            {!showCodeInput ? (
                <>
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem" }}
                        />
                    </div>
                    <button 
                        onClick={handleForgotPassword}
                        style={{ width: "100%", padding: "0.5rem" }}
                    >
                        Send Reset Code
                    </button>
                </>
            ) : (
                <>
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem" }}
                            maxLength={6}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem" }}
                        />
                    </div>
                    <button 
                        onClick={handleResetPassword}
                        style={{ width: "100%", padding: "0.5rem" }}
                    >
                        Reset Password
                    </button>
                </>
            )}
            
            {message && <p style={{ marginTop: "1rem", color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
        </div>
    );
};

export default ForgotPassword;