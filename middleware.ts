import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  
  const token = await getToken({ req: request });

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isAdminPage = request.nextUrl.pathname === "/admin";
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // Handle auth pages
  if (isAuthPage) {
    if (token) {
      if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Handle admin page access
  if (isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Handle dashboard access
  if (isDashboardPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Handle other protected routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/properties/new") ||
    request.nextUrl.pathname.startsWith("/payment");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/auth/:path*',
    '/dashboard/:path*',
    '/properties/new',
    '/payment/:path*'
  ]
};