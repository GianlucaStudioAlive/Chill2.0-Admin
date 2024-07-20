// app/admin/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '../supabaseContext';
import React from 'react'

const Page = () => {
  const { newsletterData,user,fetchSession,error } = useSupabase();
  const router = useRouter();
console.log(user, newsletterData)

 useEffect(() =>{
  fetchSession()
 },[])
  return (
  <>
       {user ? <div>
          <h1>Newsletter Data</h1>
          <ul>
            {newsletterData && newsletterData.map((item) => (
              <li key={item.id}>{item.email}</li>
            ))}
          </ul>
        </div>:<p>Non sei autorizzato ad accedere a questa pagina </p>}
  </>
  );

}

export default Page






  