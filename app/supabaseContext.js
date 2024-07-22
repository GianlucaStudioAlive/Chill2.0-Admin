// app/SupabaseContext.js

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
const SupabaseContext = createContext();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);



export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [newsletterData, setNewsletterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMerch, setLoadingMerch] = useState(true);
  const [user, setUser] = useState(null);
  const [error,setError] = useState('')
  const [merch,setMerch] = useState()
  const [guadagnoTotale, setGuadagnoTotale] = useState();
  const [pezziVenduti, setPezziVenduti] = useState();
  const [allMail,setAllMail]=useState([])
  const router = useRouter();

  const [adminID, setAdminID] = useState('');

  // useEffect(() => {
  //   if(user){const fetchAdminID = async () => {
  //     const res = await fetch('/api/getAdmin');
  //     const data = await res.json();
  //     if (data.adminID) {
  //       setAdminID(data.adminID);
  //     } else {
  //       console.error('Failed to fetch admin ID');
  //     }
  //   };
  //   fetchAdminID();}else{console.log('no admin')}
  // }, [user]);


useEffect(()=>{if(user){  const fetchNewsletter = async () => {
    if ( user) {
      const { data, error } = await supabase
      .from('newsletter')  // sostituisci 'nome_tabella' con il nome della tua tabella
      .select('*')
      if (data) {
   
      
                setNewsletterData(data)
      } else {
        throw new Error('Failed to fetch newsletter data');
      }
  
    }
  }
  
  fetchNewsletter()
  }else{console.log('none')}},[user])


useEffect(()=>{if(user){  const fetchMail= async () => {
    
    if(  user ){ const { data, error } = await supabase
    .from("mail")
    .select("*")
    .order("created_at", { ascending: false });
      if (data) {
      
      
      setAllMail(data)
      } else {
        throw new Error('Failed to fetch newsletter data');
      }
     }
    
  };fetchMail()
}else{console.log('no user')}
},[user])

const fetchMail= async () => {
    
  if(  user ){ const { data, error } = await supabase
  .from("mail")
  .select("*")
  .order("created_at", { ascending: false });
    if (data) {
    
    
    setAllMail(data)
    } else {
      throw new Error('Failed to fetch newsletter data');
    }
   }
  
}

useEffect(()=>{
   

if(user){ const fetchMerch = async () => {


const {data,error}= await supabase
.from('merch')
.select('*')
// .order('created_at',{ascending: false})
console.log(data)
if(data){

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
  console.log(error)
}
  }
  fetchMerch()

} else {
console.log(' no user')
}
 },[user,])



 const signIn = async (email, password) => {
  try {
    // Attempt to sign in with provided email and password
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (signInError) {
      console.error(signInError);
      setError('Errore di autenticazione');
      return;
    }

    // Fetch admin ID securely from server-side
    const res = await fetch('/api/getAdmin');
    const dataAdmin = await res.json();
    
    if (!dataAdmin.adminID) {
      console.error('Admin ID not found');
      setError('Errore di configurazione');
      return;
    }

    // Validate if the signed-in user is the admin
    if (signInData.user.id !== dataAdmin.adminID) {
      setError('Non sei autorizzato ad accedere a questa pagina');
      return;
    }

    // Get session data
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error(sessionError);
      setError('Errore nel recupero della sessione');
      return;
    }

    // Get user data
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error(userError);
      setError('Errore nel recupero dei dati utente');
      return;
    }

    // Set user data and navigate to admin page
    setUser(userData.user);
    router.push('/admin'); // Navigate to the admin page without refreshing

  } catch (err) {
    console.error(err);
    setError('Si è verificato un errore imprevisto');
  }
};

  
 

  return (
    <SupabaseContext.Provider value={{ signIn, newsletterData, user, loading,error,merch,guadagnoTotale,pezziVenduti,loadingMerch,fetchMail,allMail,setAllMail }}>
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
