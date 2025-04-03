import React, { useState } from "react";
import api from "../Api/Api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleForgotPassword = async () => {
        try {
            const response = await api.post("/forgot-password", { email });
            setMessage(response.data.message + " Token: " + response.data.token); // Display the token for testing
        } catch (error) {
            setMessage("Error: Unable to send reset link.");
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleForgotPassword}>Send Reset Link</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
