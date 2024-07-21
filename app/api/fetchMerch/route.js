import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ,  
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)


export async function GET(request){
    try{

const {data,error}= await supabase
.from('merch')
.select('*')
.order('created_at',{ascending: false})
if(error){throw error}
console.log(data)
return NextResponse.json(data)


    }catch(error){
        return NextResponse.json({error:error.message},{status:500});
    }
}