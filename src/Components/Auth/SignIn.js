import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, errors, message, setErrors } = useAuth();
    const navigate = useNavigate();

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

        await login(email, password);
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
            you don't have an account <Link to="/signup">Sign up</Link>



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