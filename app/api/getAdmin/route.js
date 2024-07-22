import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const adminID = process.env.ADMIN_ID;
    
    if (!adminID) {
      throw new Error('Admin ID not found');
    }

    return NextResponse.json({ adminID });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
