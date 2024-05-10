"use client";
import React, { useState } from 'react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-screen w-full sm:max-w-md p-8 space-y-6 rounded-lg">

                <div className="w-20 flex flex-col mx-auto justify-center">
                <img src="/logo.png" alt="Logo" className="mx-auto w-15 h-15 -mt-7" />

                    <h1 className="mx-auto font-bold tracking-wide">OrthoChat</h1>

                </div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                />
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="ml-2 text-sm">Remember me</span>
                    </label>
                    <a href="#" className="ml-14 text-sm text-blue-500 hover:underline">Forgot Password?</a>
                </div>
                <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                    Sign in
                </button>
                <button type="button" className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <img src="/g-logo.svg" alt="Google" className="w-5 h-5 mr-2" />
                        Sign in with Google
                </button>

                <p className="text-sm text-center">Don’t have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a></p>
            </form>
        </div>
    );
};

export default Login;
