// app/SupabaseContext.js

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [newsletterData, setNewsletterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error,setError] = useState('')
  const router = useRouter();

  const fetchSession = async () => {
    if (user) {
      const res = await fetch('/api/newsletter');
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setNewsletterData(data);
      } else {
        throw new Error('Failed to fetch newsletter data');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [user]);

  const signIn = async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      if (data.user) {
        setUser(data.user.id);
        router.push('/admin'); // Navigate to the admin page without refreshing
      }
    } else {
      setError('Non sei autorizzato ad accedere a questa pagina')
      throw new Error('Login failed');
    }
  };

  console.log(newsletterData, user);

  return (
    <SupabaseContext.Provider value={{ signIn, newsletterData, user, loading,fetchSession,error }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
