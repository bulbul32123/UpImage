import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get or create user session ID
 */
export async function getUserSession() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('pdf_chat_session')?.value;
  
  if (!sessionId) {
    sessionId = uuidv4();
    cookieStore.set('pdf_chat_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });
  }
  
  return sessionId;
}