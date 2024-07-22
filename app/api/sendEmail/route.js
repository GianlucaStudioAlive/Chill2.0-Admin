import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { createClient } from '@supabase/supabase-js';
// Configura il client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON input" },
      { status: 400 }
    );
  }



 const { newsletter,messaggio,titolo, oggetto } = data;
  const {data:postMail,error}=await supabase
  .from('mail')
  .insert([{
    titolo:titolo,
    oggetto:oggetto,
    messaggio:messaggio
  }])
  .select()
if(error){console.log(error)}

 

  const emailPromises = newsletter.map(( email ) => {
  
    const msg = {
      to: email.email,
      from: {
        email: 'info@chillduepuntozero.it',
        name: 'Chill2.0 - Newsletter'
      },
      subject:`${oggetto}`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://www.chillduepuntozero.it/_next/image?url=%2FChill_Logo_Index.png&w=1080&q=75" alt="ChillDuePuntoZero" style="width: 150px;height: 300px; object-fit:contain">
          </div>
         <h3 style="text-align: center;">${titolo}</h3>
          <p> ${messaggio}</p>
          
      
          <p>Rimani chillato,</p>
          <p>Il team di ChillDuePuntoZero</p>
          <div style="text-align: center; margin-top: 20px;">
              <a href="https://chillduepuntozero.it" style="color: #00aaff; text-decoration: none;">Visita il nostro sito</a>
          </div>
      </div>
  `
    };

    return sgMail.send(msg);
  });

  try {
    // Invia tutte le email in parallelo
    await Promise.all(emailPromises);

    return NextResponse.json(
      { message: "Emails Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to Send Emails", error },
      { status: 500 }
    );
  }
}
