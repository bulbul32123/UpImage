// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRE = '7d';
const COOKIE_NAME = 'auth_token';

export function generateToken(userId){
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
}

export function verifyToken(token){
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { userId: decoded.userId };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
export async function setAuthCookie(token){
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
export async function verifyAuth(request) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return {
        authenticated: false,
        error: 'No authentication token found'
      };
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return {
        authenticated: false,
        error: 'Invalid or expired token'
      };
    }

    return {
      authenticated: true,
      userId: decoded.userId
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      authenticated: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

export async function getCurrentUser(){
  try {
    const token = await getAuthCookie();
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export function validatePassword(password){
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
export function validateEmail(email){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function hashPassword(password){
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function comparePassword(password, hash){
  
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

export async function refreshAuthToken(){
  try {
    const token = await getAuthCookie();

    if (!token) {
      return {
        success: false,
        error: 'No token to refresh'
      };
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return {
        success: false,
        error: 'Invalid token'
      };
    }

    // Generate new token
    const newToken = generateToken(decoded.userId);

    // Set new cookie
    await setAuthCookie(newToken);

    return {
      success: true,
      token: newToken
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      error: error
    };
  }
}