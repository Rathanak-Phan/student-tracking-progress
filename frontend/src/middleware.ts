import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // 1. Define protected routes and their required roles
  const protectedRoutes = {
    '/student': 'student',
    '/teacher': 'teacher',
    '/admin': 'admin',
  };

  // 2. Check if the user is trying to access a protected route
  const matchingProtectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );

  if (matchingProtectedRoute) {
    // If no token, redirect to login
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // If role doesn't match the required role for this route
    const requiredRole = protectedRoutes[matchingProtectedRoute as keyof typeof protectedRoutes];
    if (role !== requiredRole) {
      // Redirect to their respective dashboard if they are in the wrong place
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
      if (role === 'teacher') return NextResponse.redirect(new URL('/teacher', request.url));
      if (role === 'student') return NextResponse.redirect(new URL('/student', request.url));
      
      // If role is unknown, logout
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('user');
      response.cookies.delete('role');
      return response;
    }
  }

  // 3. Prevent authenticated users from visiting login/signup
  if (pathname === '/login' || pathname === '/signup') {
    if (token && role) {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
      if (role === 'teacher') return NextResponse.redirect(new URL('/teacher', request.url));
      if (role === 'student') return NextResponse.redirect(new URL('/student', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};
