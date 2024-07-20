import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const userID = process.env.ADMIN_ID;

export async function POST(request) {
  console.log(userID);
  const { email, password } = await request.json();

  console.log('Login request received:', email);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.log('Login error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  console.log('Login successful:', data.user.id === userID);
  if (data.user.id === userID) {
    const response = NextResponse.json({ user: data.user });
    response.cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
    });
    console.log('Token set in cookie:', data.session.access_token);
    return response; // Return the response after setting the cookie
  } else {
    console.log('Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}
