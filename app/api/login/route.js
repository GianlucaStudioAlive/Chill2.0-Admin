import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const userID = process.env.ADMIN_ID;

export async function POST(request) {

  const { email, password } = await request.json();

 

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
   
    return NextResponse.json({ error: error.message }, { status: 401 });
  }


  if (data.user.id === userID) {
    const response = NextResponse.json({ user: data.user });
   
    return response; // Return the response after setting the cookie
  } else {
    
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}
