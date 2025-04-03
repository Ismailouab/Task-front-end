import React, { useState } from 'react';
import api from '../Api/Api';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);
    const Navigate = useNavigate()


    const validateForm = () => {
        const newErrors = [];

        if (email.trim() === '' || password.trim() === '') {
            newErrors.push('All fields are required');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.push('Please enter a valid email address');
        }
        if (password.length < 6) {
            newErrors.push('Password must be at least 6 characters long');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await api.post('/login', { email, password });
            setMessage('Login successful!');
            setErrors([]);
            // Store token and user data
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            Navigate('/Dashboard')


        } catch (error) {
            console.error(error);
            setMessage('Login failed!');
            setErrors(['Invalid email or password']);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">Sign In</button>
            </form>

            {errors.length > 0 && (
                <div style={{ color: 'red' }}>
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default SignIn;
