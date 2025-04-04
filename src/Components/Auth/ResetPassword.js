import React, { useState } from "react";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
    const [token, setToken] = useState(null);
  
    const sendResetCode = async () => {
      try {
        await axios.post('/api/auth/password/reset-code', { email });
        setStep(2);
      } catch (error) {
        alert('Error sending reset code');
      }
    };
  
    const verifyCode = async () => {
      try {
        const response = await axios.post('/api/auth/password/verify-code', { 
          email, 
          code 
        });
        setToken(response.data.token);
        setStep(3);
      } catch (error) {
        alert('Invalid code');
      }
    };
  
    const resetPassword = async () => {
      try {
        await axios.post('/api/auth/password/reset', { 
          email, 
          token, 
          password, 
          password_confirmation: passwordConfirmation 
        });
        alert('Password reset successfully!');
        // Redirect to login
      } catch (error) {
        alert('Error resetting password');
      }
    };
  
    return (
      <div>
        {step === 1 && (
          <div>
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendResetCode}>Send Reset Code</button>
          </div>
        )}
  
        {step === 2 && (
          <div>
            <h2>Enter Reset Code</h2>
            <p>We sent a code to {email}</p>
            <input
              type="text"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={verifyCode}>Verify Code</button>
          </div>
        )}
  
        {step === 3 && (
          <div>
            <h2>New Password</h2>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <button onClick={resetPassword}>Reset Password</button>
          </div>
        )}
      </div>
    );
  }

export default ResetPassword;
