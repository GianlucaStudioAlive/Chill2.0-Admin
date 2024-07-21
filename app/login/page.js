// app/login/page.js

'use client';

import { useState } from 'react';
import { useSupabase } from '../supabaseContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn,error } = useSupabase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error&&error}
    </form>
  );
}
