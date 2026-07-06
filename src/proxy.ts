import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass static paths, public folder, api routes, and admin endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/logo.svg') ||
    pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }

  // Check if market cookie is present
  const marketCookie = request.cookies.get('market')?.value;

  if (!marketCookie) {
    // Detect country header (Vercel Geo-IP)
    const country = request.headers.get('x-vercel-ip-country') || 'US';
    const detectedMarket = country.toUpperCase() === 'PK' ? 'pk' : 'int';

    // Create a response and set the cookie
    const response = NextResponse.next();
    response.cookies.set('market', detectedMarket, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)'],
};
