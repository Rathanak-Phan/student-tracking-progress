"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  syncSession: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get('token');
    const storedUser = Cookies.get('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Background sync to fetch the latest profile data
      api.get('/users/me')
        .then(response => {
          const data = response.data;
          const updatedUser = { 
            ...parsedUser, 
            name: data.first_name || data.username || parsedUser.name,
            avatar: data.avatar_url,
            role: data.role || parsedUser.role
          };
          setUser(updatedUser);
          Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
          if (data.role) {
            Cookies.set('role', data.role, { expires: 7 });
          }
        })
        .catch(err => console.error("Failed to sync user context", err));
    }
    setIsLoading(false);
  }, []);

  const syncSession = async () => {
    try {
      const response = await api.get('/users/me');
      const data = response.data;
      if (user) {
        const updatedUser = { 
          ...user, 
          name: data.first_name || data.username || user.name,
          avatar: data.avatar_url,
          role: data.role || user.role
        };
        setUser(updatedUser);
        Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
        if (data.role) {
          Cookies.set('role', data.role, { expires: 7 });
        }
      }
    } catch (err) {
      console.error("Failed to manual sync session", err);
    }
  };

  const login = (newToken: string, newUser: User) => {
    // Set cookies with a 7-day expiry
    Cookies.set('token', newToken, { expires: 7 });
    Cookies.set('user', JSON.stringify(newUser), { expires: 7 });
    Cookies.set('role', newUser.role, { expires: 7 }); // Extra cookie for easier middleware access
    
    setToken(newToken);
    setUser(newUser);
    
    // Redirect based on role
    if (newUser.role === 'admin') router.push('/admin');
    else if (newUser.role === 'teacher') router.push('/teacher');
    else router.push('/student');
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('role');
    
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, syncSession, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
