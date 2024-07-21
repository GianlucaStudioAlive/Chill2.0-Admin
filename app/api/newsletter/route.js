import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Configura il client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  try {
    // Esegui una query su Supabase
    const { data, error } = await supabase
      .from('newsletter')  // sostituisci 'nome_tabella' con il nome della tua tabella
      .select('*');

    if (error) {
      throw error;
    }

    // Rispondi con i dati ottenuti
    return NextResponse.json(data);
  } catch (error) {
    // Gestisci eventuali errori
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}