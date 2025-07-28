import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: { full_name?: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  // Legacy compatibility
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.warn('No profile found for user, using default:', error.message);
        // If no profile exists, create a default user object
        setUser({
          id: userId,
          name: userEmail.split('@')[0], // Use email prefix as fallback name
          email: userEmail,
          role: 'student', // Default role
        });
      } else if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || userEmail.split('@')[0],
          email: profile.email || userEmail,
          role: profile.role || 'student',
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to basic user info if profile fetch fails
      setUser({
        id: userId,
        name: userEmail.split('@')[0],
        email: userEmail,
        role: 'student',
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || '');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } finally {
      // Don't set loading to false here - let the auth state change handler do it
    }
  };

  const signUp = async (email: string, password: string, userData?: { full_name?: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData || {}
      }
    });
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!session && !!user;

  // Legacy compatibility methods
  const login = signIn;
  const logout = signOut;

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      isAuthenticated,
      // Legacy compatibility
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};