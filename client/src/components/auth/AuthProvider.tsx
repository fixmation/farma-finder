import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'customer' | 'pharmacy' | 'laboratory' | 'admin' | 'developer_admin';
  status: 'pending' | 'verified' | 'suspended' | 'rejected';
  preferred_language: 'en' | 'si' | 'ta';
}

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('farmaFinder_user');
    const storedProfile = localStorage.getItem('farmaFinder_profile');
    
    if (storedUser && storedProfile) {
      setUser(JSON.parse(storedUser));
      setProfile(JSON.parse(storedProfile));
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // For now, create a simple mock user
      // In a real implementation, this would call your backend API
      const newUser: AuthUser = {
        id: `user_${Date.now()}`,
        email
      };
      
      const newProfile: UserProfile = {
        id: newUser.id,
        email,
        full_name: userData.fullName || '',
        phone: userData.phone || null,
        role: userData.role || 'customer',
        status: 'pending',
        preferred_language: 'en'
      };

      // Store in localStorage for demo purposes
      localStorage.setItem('farmaFinder_user', JSON.stringify(newUser));
      localStorage.setItem('farmaFinder_profile', JSON.stringify(newProfile));
      
      setUser(newUser);
      setProfile(newProfile);
      
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Failed to create account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, accept any credentials
      const user: AuthUser = {
        id: `user_${email.replace('@', '_').replace('.', '_')}`,
        email
      };
      
      const profile: UserProfile = {
        id: user.id,
        email,
        full_name: email.split('@')[0],
        phone: null,
        role: 'customer',
        status: 'verified',
        preferred_language: 'en'
      };

      localStorage.setItem('farmaFinder_user', JSON.stringify(user));
      localStorage.setItem('farmaFinder_profile', JSON.stringify(profile));
      
      setUser(user);
      setProfile(profile);
      
      toast.success('Signed in successfully!');
    } catch (error) {
      toast.error('Failed to sign in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('farmaFinder_user');
      localStorage.removeItem('farmaFinder_profile');
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};