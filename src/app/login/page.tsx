"use client";
import React, { useState } from "react";
import Image from "next/image";
import { LuEye, LuEyeOff, LuXCircle } from "react-icons/lu";
import axios from "axios"; // For making API requests

import Input from "../components/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState(""); // New state for the test email input

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(email, password);
  };

  const clearEmail = () => setEmail("");
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Function to send a test email
  const sendTestEmail = async () => {
    try {
      const response = await axios.post("/api/email", {
        to: testEmail,
      });
      if (response.status === 200) {
        alert("Test email sent successfully!");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send test email.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-base-100 p-4 dark:bg-slate-800">
      <div className="my-16 w-full max-w-md py-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="mx-auto h-14 w-14"
        />
        <h1 className="text-center text-[40px] font-bold tracking-wide text-accent-focus dark:text-slate-400">
          OrthoChat
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="my-2 w-full max-w-md flex-1 space-y-8 p-4"
      >
        {/* Email Input */}
        <div className="relative flex h-11 w-full items-center">
          <Input
            
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {email && (
            <button
              type="button"
              onClick={clearEmail}
              className="absolute right-2"
            >
              <LuXCircle strokeWidth={1} size={25} className="text-accent" />
            </button>
          )}
        </div>

        {/* Password Input */}
        <div className="relative flex h-11 w-full items-center">
          <Input
          
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {password && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2"
            >
              {showPassword ? (
                <LuEyeOff strokeWidth={1} size={25} className="text-accent" />
              ) : (
                <LuEye strokeWidth={1} size={25} className="text-accent" />
              )}
            </button>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 accent-primary-focus" />
            <span className="ml-2 text-sm text-accent-focus dark:text-slate-400">
              Remember me
            </span>
          </label>
          <a
            href="#"
            className="text-sm font-medium text-primary hover:text-primary-focus"
          >
            Forgot Password?
          </a>
        </div>

        {/* Buttons */}
        <div className="space-y-8 pt-8">
          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-primary font-medium text-app-white hover:bg-primary-focus"
          >
            Sign in
          </button>
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-app-white font-medium text-accent-focus hover:bg-base-200"
          >
            <Image
              src="/g-logo.svg"
              alt="Google"
              width={80}
              height={80}
              className="mr-2 h-5 w-5"
            />
            Sign in with Google
          </button>
        </div>
        <p className="text-center text-sm">
          Don&lsquo;t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-primary hover:text-primary-focus"
          >
            Sign up
          </a>
        </p>

        {/* Test Email Input and Button */}
        <div className="mt-8">
          <h3 className="text-center text-lg font-semibold text-accent-focus dark:text-slate-400">
            Test Email
          </h3>
          <div className="flex items-center space-x-4">
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email"
            />
            <button
              type="button"
              onClick={sendTestEmail}
              className="h-11 rounded-lg bg-primary px-4 font-medium text-app-white hover:bg-primary-focus"
            >
              Send Test Email
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
