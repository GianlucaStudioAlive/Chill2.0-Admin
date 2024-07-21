// app/SupabaseContext.js

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [newsletterData, setNewsletterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMerch, setLoadingMerch] = useState(true);
  const [user, setUser] = useState(true);
  const [error,setError] = useState('')
  const [merch,setMerch] = useState([])
  const [guadagnoTotale, setGuadagnoTotale] = useState();
  const [pezziVenduti, setPezziVenduti] = useState();
  const router = useRouter();

  const fetchSession = async () => {
    if (user) {
      const res = await fetch("/api/newsletter");
      if (res.ok) {
        const data = await res.json();
      
                setNewsletterData(data)
      } else {
        throw new Error('Failed to fetch newsletter data');
      }
      setLoading(false);
    }
  };

 const fetchMerch = async () => {
  setLoadingMerch(true);
  if( user ){
const res = await fetch("/api/fetchMerch")
if(res.ok){
  const data = await res.json()
  setMerch(data)
  const guadagno = data.map((item) => item.price);

  let somma = 0;
  for (let i = 0; i < guadagno.length; i++) {
    somma += guadagno[i];
  }
  const venduto = data.map((item) => item.quantity);

  let sold = 0;
  for (let i = 0; i < venduto.length; i++) {
    sold += venduto[i];
  }
  setPezziVenduti(sold);

  setGuadagnoTotale(somma.toFixed(2));
setLoadingMerch(false);  

 
} else {
  throw new Error('Failed to fetch merch data');
}
  }
return
 }


  const signIn = async (email, password) => {
    const res = await fetch("api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
    
      if (data.user) {
        setUser(data.user.id);
        router.push('/admin'); // Navigate to the admin page without refreshing
      }
    } else {
      setError('Non sei autorizzato ad accedere a questa pagina')
      throw new Error('Login failed');
    }
  };

 

  return (
    <SupabaseContext.Provider value={{ signIn, newsletterData, user, loading,fetchSession,error,fetchMerch,merch,guadagnoTotale,pezziVenduti,loadingMerch }}>
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
