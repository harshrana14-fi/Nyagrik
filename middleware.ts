import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected paths
const protectedPaths = [
  '/dashboard/client',
  '/dashboard/lawyer',
  '/dashboard/intern',
];

// Middleware logic
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Read token from cookies (you can customize the cookie name)
  const token = request.cookies.get('token')?.value;

  if (isProtected && !token) {
    // Redirect to login if unauthenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
