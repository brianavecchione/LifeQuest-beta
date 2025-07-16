import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle successful Google OAuth sign-in
        if (event === 'SIGNED_IN' && session?.user && window.location.pathname === '/auth') {
          window.location.href = '/';
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName || 'Adventurer'
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    return { error };
  };

  const signOut = async () => {
    try {
      // Sign out from Supabase first
      await supabase.auth.signOut();
      
      // Clear local state completely
      setSession(null);
      setUser(null);
      setLoading(false);
      
      // Clear any stored auth data
      localStorage.removeItem('sb-iiivtylfvnntjxzyximw-auth-token');
      
      // Force navigation to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error during signout:', error);
      
      // Force clear everything even if signout fails
      setSession(null);
      setUser(null);
      setLoading(false);
      localStorage.removeItem('sb-iiivtylfvnntjxzyximw-auth-token');
      
      // Force redirect
      window.location.href = '/auth';
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        return { error: { message: 'No user to delete' } };
      }

      // Call the edge function to handle account deletion
      const { error } = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      
      if (error) {
        console.error('Error deleting user account:', error);
        return { error };
      }

      // Clear local state
      setSession(null);
      setUser(null);
      setLoading(false);
      
      // Clear any stored auth data
      localStorage.removeItem('sb-iiivtylfvnntjxzyximw-auth-token');
      
      return { error: null };
    } catch (error) {
      console.error('Error during account deletion:', error);
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};