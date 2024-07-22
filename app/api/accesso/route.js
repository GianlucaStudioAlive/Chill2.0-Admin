import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const userID = process.env.ADMIN_ID;

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.log('Login error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (data.user.id === userID) {
      return NextResponse.json({ user: data.user });
    } else {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
  } catch (error) {
    console.error('Request handling error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}