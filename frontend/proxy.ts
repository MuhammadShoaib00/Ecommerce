import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/cart', '/checkout', '/orders'];
const ADMIN_PREFIX = '/admin';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isProtectedRoute = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!token && (isAdminRoute || isProtectedRoute)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cart', '/checkout', '/orders', '/orders/:path*'],
};
