import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    // Remove auth cookie
    await removeAuthCookie();
    
    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Signout error:', error);
    
    return NextResponse.json(
      { success: false, message: 'An error occurred during signout' },
      { status: 500 }
    );
  }
}