"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { HomeIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const pendingMessage = searchParams.get('message') === 'pending' 
    ? "Registration successful. Please wait for admin validation to login." 
    : "";
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5002/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // The backend returns { userId, role, accessToken, refreshToken }
      // We need to match the User interface in AuthContext
      const user = {
        id: data.userId,
        name: data.name || email.split('@')[0], 
        email: email,
        role: data.role as 'admin' | 'teacher' | 'student',
        avatar: data.avatar_url
      };

      login(data.accessToken, user);
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="fixed top-8 left-8 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 shadow-2xl"
        >
          <HomeIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-sm font-semibold tracking-tight">Home</span>
        </Link>
      </div>

      <div className="space-y-3">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-white tracking-tight"
        >
          Welcome Back
        </motion.h1>
        <p className="text-gray-400 font-medium">
          New here?{" "}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-bold decoration-2 underline-offset-4 hover:underline transition-all">
            Create an account
          </Link>
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm font-bold text-center"
        >
          {error}
        </motion.div>
      )}

      {pendingMessage && !error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-md text-sm font-bold text-center"
        >
          {pendingMessage}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
            Work Email
          </label>
          <div className="relative group">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="email"
              type="email"
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-md focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-medium"
              placeholder="john.doe@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
              Password
            </label>
            <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
              Forgot?
            </Link>
          </div>
          <div className="relative group">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="password"
              type="password"
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-md focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center ml-1">
          <input
            id="remember-me"
            type="checkbox"
            className="h-5 w-5 bg-white/5 border-white/10 rounded-md text-blue-600 focus:ring-blue-500/50 focus:ring-offset-gray-950 transition-all cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-3 text-sm font-bold text-gray-400 cursor-pointer select-none">
            Keep me signed in
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-md hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-900/20 uppercase tracking-widest"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Authenticating...</span>
            </div>
          ) : (
            "Secure Login"
          )}
        </button>
      </form>
    </div>
  );
}
