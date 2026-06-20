"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { HomeIcon, UserIcon, EnvelopeIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SignUpForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as const
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5002/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(data.message || "Registration successful!");
      
      // Auto-login after successful registration
      const user = {
        id: data.userId,
        name: formData.username,
        email: formData.email,
        role: formData.role
      };

      // Delay slightly for UX so they see the success message
      setTimeout(() => {
        if (data.accessToken) {
          login(data.accessToken, user);
        } else {
          window.location.href = '/login?message=pending';
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
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
          Create Account
        </motion.h1>
        <p className="text-gray-400 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold decoration-2 underline-offset-4 hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm font-bold text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-md text-sm font-bold text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
            Username
          </label>
          <div className="relative group">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="username"
              type="text"
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-md focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-medium"
              placeholder="alexjohnson"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
            Email Address
          </label>
          <div className="relative group">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="email"
              type="email"
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-md focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-medium"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>



        <div className="space-y-2">
          <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
            Create Password
          </label>
          <div className="relative group">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="password"
              type="password"
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-md focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-medium"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
            Confirm Password
          </label>
          <div className="relative group">
            <CheckCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="confirmPassword"
              type="password"
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-md focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 font-medium"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-md hover:bg-blue-500 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20 uppercase tracking-widest disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}