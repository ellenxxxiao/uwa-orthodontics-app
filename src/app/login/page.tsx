"use client";
import React, { useState } from 'react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(email, password);
    };

    const clearEmail = () => setEmail('');
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-4"> 
            <div className="w-full max-w-md px-8 py-12 mt-8">
                <img src="/logo.png" alt="Logo" className="mx-auto w-20 h-20" />
                <h1 className="text-4xl font-bold tracking-wide text-center text-accent-focus">OrthoChat</h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-6 rounded-lg min-h-screen">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {email && (
                        <button type="button" onClick={clearEmail} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <img src="/x-icon.png" alt="Clear" className="w-5 h-5"/>
                        </button>
                    )}
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <img src={showPassword ? "/hide-icon.png" : "/hide-icon.png"} alt={showPassword ? "Show" : "Hide"} className="w-5 h-5"/>
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="ml-2 text-sm">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-primary hover:text-primary-focus">Forgot Password?</a>
                </div>
                <button type="submit" className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-focus">
                    Sign in
                </button>
                <button type="button" className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-base-200 w-full">
                    <img src="/g-logo.svg" alt="Google" className="w-5 h-5 mr-2" />
                    Sign in with Google
                </button>
                <p className="text-sm text-center">Don’t have an account? <a href="/register" className="text-primary hover:text-primary-focus">Sign up</a></p>
            </form>
        </div>
    );
};

export default Login;
