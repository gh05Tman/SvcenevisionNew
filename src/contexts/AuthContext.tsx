
"use client";

import type { UserProfile } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>; // Simplified
  signUp: (email: string, pass: string) => Promise<void>; // Simplified
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: UserProfile = {
  uid: 'mock-user-123',
  email: 'user@example.com',
  displayName: 'Mock User',
  photoURL: 'https://placehold.co/100x100.png',
  tier: 'pro',
  createdAt: new Date().toISOString(),
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state
    const storedUser = localStorage.getItem('sceneVisionUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const signedInUser = { ...mockUser, email };
    setUser(signedInUser);
    localStorage.setItem('sceneVisionUser', JSON.stringify(signedInUser));
    setLoading(false);
  };

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const signedUpUser = { ...mockUser, email, displayName: email.split('@')[0] };
    setUser(signedUpUser);
    localStorage.setItem('sceneVisionUser', JSON.stringify(signedUpUser));
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('sceneVisionUser');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
