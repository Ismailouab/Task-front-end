import React, { useState } from 'react'
import api from '../Api/Api'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setpassword_confirmation] = useState('')
    const [userData, setUserData] = useState([])
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState([])

    const Navigate = useNavigate()
    const validateForm = () => {
        const newErrors = []
        setErrors([]);

        if (name === '' || email === '' || password === '' || password_confirmation === '') {
            newErrors.push('All fields are require')
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.push('Please enter a valid email address');
        }
        if (password !== password_confirmation) {
            newErrors.push('Passwords do not match')

        }
        if (password.length < 6) {
            newErrors.push('Password must be at least 6 characters long')
        }
        setErrors(newErrors)
        return newErrors.length === 0;


    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return;
        }

        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone

            })
            setUserData(response.data)
            setMessage('Registration successful!')
            setErrors([]);
            Navigate('/SignIn')

        } catch (error) {
            console.log(error)
            setMessage('Registration failed!')

        }

    }



    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} require />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} require />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} require />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" value={password_confirmation} onChange={(e) => setpassword_confirmation(e.target.value)} require />
                </div>
                <button type="submit">Sign Up</button>
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
    )
}

export default SignUp
