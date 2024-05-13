"use client";
import React, { useState } from "react";
import Image from "next/image";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(email, password, confirmPassword);
  };

  const clearEmail = () => setEmail("");
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex min-h-screen flex-col justify-between p-4">
      <div className="mt-8 rounded-lg px-8 py-12">
        <img src="/logo.png" alt="Logo" className="mx-auto h-20 w-20" />
        <h1 className="text-center text-4xl font-bold tracking-wide text-accent-focus">
          OrthoChat
        </h1>
        <h3 className="text-md text-center text-accent">
          Create your account now
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto min-h-screen w-full max-w-md space-y-6 rounded-lg p-8"
      >
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {email && (
            <button
              type="button"
              onClick={clearEmail}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <Image src="/x-icon.png" alt="Clear" className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Image
              src={showPassword ? "/hide-icon.png" : "/hide-icon.png"}
              alt={showPassword ? "Show" : "Hide"}
              className="h-5 w-5"
            />
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <img
              src={showConfirmPassword ? "/hide-icon.png" : "/hide-icon.png"}
              alt={showConfirmPassword ? "Show" : "Hide"}
              className="h-5 w-5"
            />
          </button>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-focus"
        >
          Sign Up
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-base-200"
        >
          <img src="/g-logo.svg" alt="Google" className="mr-2 h-5 w-5" />
          Sign in with Google
        </button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:text-primary-focus">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
