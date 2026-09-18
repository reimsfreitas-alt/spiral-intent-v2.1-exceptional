import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MATRIX_URL = 'https://spiral-os-s5m62f.v2.appdeploy.ai/';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();
  if (host === 'spiralwealth.com.br' && request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(MATRIX_URL);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
