
"use client";

import type { UserProfile } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast'; // Added useToast

// --- DEV MODE FLAG ---
// Set this to true to bypass auth and use a mock pro user for development.
// Remember to set to false or use an environment variable for production.
const IS_DEV_MODE = true;
// ---------------------

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDevMode: boolean; // Expose dev mode status
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base mock user data
const baseMockUser: Omit<UserProfile, 'uid' | 'email' | 'displayName' | 'createdAt'> = {
  photoURL: 'https://placehold.co/100x100.png',
  tier: 'pro',
};

const devUser: UserProfile = {
  uid: 'dev-user-001',
  email: 'dev@scenevision.app',
  displayName: 'Dev User (Pro Tier)',
  photoURL: 'https://placehold.co/100x100.png?text=DEV',
  tier: 'pro',
  createdAt: new Date().toISOString(),
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (IS_DEV_MODE) {
      setUser(devUser);
      setLoading(false);
      console.log("AuthContext: Dev mode active. Signed in as Dev User.");
    } else {
      // Simulate checking auth state
      const storedUser = localStorage.getItem('sceneVisionUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Ensure the stored user has a tier, default to 'amateur' if not present
          if (!parsedUser.tier) {
            parsedUser.tier = 'amateur';
          }
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse stored user:", e);
          localStorage.removeItem('sceneVisionUser');
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    if (IS_DEV_MODE) {
      toast({ title: "Dev Mode Active", description: "Authentication is bypassed." });
      setUser(devUser); // Ensure dev user is set
      setLoading(false);
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    const signedInUser: UserProfile = {
      ...baseMockUser,
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0] || 'User',
      createdAt: new Date().toISOString(),
      tier: 'pro', // Default to pro for this example, adjust as needed
    };
    setUser(signedInUser);
    localStorage.setItem('sceneVisionUser', JSON.stringify(signedInUser));
    setLoading(false);
  };

  const signUp = async (email: string, pass: string) => {
    if (IS_DEV_MODE) {
      toast({ title: "Dev Mode Active", description: "Authentication is bypassed." });
      setUser(devUser); // Ensure dev user is set
      setLoading(false);
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    const signedUpUser: UserProfile = {
      ...baseMockUser,
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0] || 'New User',
      createdAt: new Date().toISOString(),
      tier: 'amateur', // New sign-ups might start on a free/amateur tier
    };
    setUser(signedUpUser);
    localStorage.setItem('sceneVisionUser', JSON.stringify(signedUpUser));
    setLoading(false);
  };

  const signOut = async () => {
    if (IS_DEV_MODE) {
      toast({ title: "Dev Mode Active", description: "Sign out is symbolic in dev mode. Refresh to reset if needed." });
      // To truly "sign out" of dev mode, the flag IS_DEV_MODE would need to be toggled and app refreshed.
      // Or, we could set user to null:
      // setUser(null); 
      // setLoading(false);
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    setUser(null);
    localStorage.removeItem('sceneVisionUser');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isDevMode: IS_DEV_MODE }}>
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
