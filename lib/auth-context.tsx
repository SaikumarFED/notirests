'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  supabase,
  getCurrentUserProfile,
} from './supabase';

import { AuthUser, UserProfile } from './types';

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);

          const userProfile =
            await getCurrentUserProfile();

          setProfile(userProfile || null);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error(
          'Auth initialization error:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          if (session?.user) {
            setUser(session.user);

            const userProfile =
              await getCurrentUserProfile();

            setProfile(userProfile || null);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error(
            'Auth state change error:',
            error
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();

      setUser(null);
      setProfile(null);

      window.location.href = '/';
    } catch (error) {
      console.error(
        'Sign out error:',
        error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}
