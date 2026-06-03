import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext();

const formatUser = (authUser) => {
  if (!authUser) return null;

  return {
    id: authUser.id,
    email: authUser.email,
    user_metadata: authUser.user_metadata || {},
  };
};

const formatAuthError = (error) => ({
  message: error?.message || 'Authentication failed',
  status: error?.status ?? null,
  code: error?.code ?? null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const { data } = await supabase.auth.getSession();
      const sessionUser = formatUser(data.session?.user);

      if (mounted) {
        setUser(sessionUser);
        setLoading(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = formatUser(session?.user);
      setUser(sessionUser);
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { data: null, error: formatAuthError(error) };

    const userData = formatUser(data.user);
    setUser(userData);
    return { data: { user: userData }, error: null };
  };

  const signUp = async (email, password, fullName = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
        },
      },
    });

    if (error) return { data: null, error: formatAuthError(error) };

    const userData = formatUser(data.user);
    setUser(userData);
    return { data: { user: userData }, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    if (error) return { error: formatAuthError(error) };
    return { error: null };
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
