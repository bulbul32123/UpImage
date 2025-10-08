import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ['/auth/signin', '/auth/signup', '/auth/forgot-password'];
  const protectedPaths = ['/dashboard', '/user-profile-management', '/user/profile'];

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // If token exists and user tries to visit public page, redirect to dashboard
  if (token && isPublicPath) {
    const verified = await verifyToken(token); // <-- await here if verifyToken is async
    if (verified) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If no token and user tries to visit protected page, redirect to signin
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If token exists but invalid, redirect to signin
  if (token && isProtectedPath) {
    const verified = await verifyToken(token);
    if (!verified) {
      const response = NextResponse.redirect(new URL('/auth/signin', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/auth/:path*'
  ]
};
