import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Added imports

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const { register, errors, message, setErrors } = useAuth();
    const navigate = useNavigate(); // Added navigation hook

    const validateForm = () => {
        const newErrors = [];
        setErrors([]);

        if (!name.trim()) newErrors.push('Name is required');
        if (!email.trim()) newErrors.push('Email is required');
        if (!password) newErrors.push('Password is required');
        if (!password_confirmation) newErrors.push('Password confirmation is required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.push('Invalid email format');
        if (password !== password_confirmation) newErrors.push('Passwords do not match');
        if (password.length < 6) newErrors.push('Password must be at least 6 characters');

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const success = await register(name, email, password, password_confirmation);
            if (success) {
                navigate('/signin'); // Redirect to sign in after successful registration
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        disabled={isLoading}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        disabled={isLoading}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        disabled={isLoading}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input 
                        type="password" 
                        value={password_confirmation} 
                        onChange={(e) => setPasswordConfirmation(e.target.value)} 
                        disabled={isLoading}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Sign Up'}
                </button>
            </form>

            <div className="auth-switch">
                Already have an account? <Link to="/signin">Sign In</Link>
            </div>

            {errors.length > 0 && (
                <div className="error-messages">
                    {errors.map((error, index) => (
                        <p key={index} className="error-message">{error}</p>
                    ))}
                </div>
            )}
            
            {message && <p className="success-message">{message}</p>}
        </div>
    );
};

export default SignUp;