import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { AxiosResponse } from 'axios';
import { parseSetCookie } from 'cookie';
import { api } from './lib/api/api';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

const setServerCookies = (
  response: NextResponse,
  axiosRes: AxiosResponse,
): boolean => {
  const setCookie = axiosRes.headers['set-cookie'];

  if (!setCookie) {
    return false;
  }

  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const cookieString of cookieArray) {
    const parsed = parseSetCookie(cookieString);

    const options = {
      expires: parsed.expires,
      path: parsed.path ?? '/',
      maxAge: parsed.maxAge,
    };

    if (parsed.name === 'accessToken' && parsed.value !== undefined) {
      response.cookies.set('accessToken', parsed.value, options);
    }

    if (parsed.name === 'refreshToken' && parsed.value !== undefined) {
      response.cookies.set('refreshToken', parsed.value, options);
    }
  }

  return true;
};

const checkSession = (cookieHeader: string) => {
  return api.get('/auth/session', {
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const isPrivate = privateRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isPublic = publicRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const cookieHeader = req.headers.get('cookie') ?? '';

  if (isPrivate && !accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', origin));
    }

    try {
      const authRes = await checkSession(cookieHeader);
      const response = NextResponse.next();

      if (setServerCookies(response, authRes)) {
        return response;
      }

      return NextResponse.redirect(new URL('/sign-in', origin));
    } catch {
      return NextResponse.redirect(new URL('/sign-in', origin));
    }
  }

  if (isPublic) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/', origin));
    }

    if (refreshToken) {
      try {
        const authRes = await checkSession(cookieHeader);
        const response = NextResponse.redirect(new URL('/', origin));

        if (setServerCookies(response, authRes)) {
          return response;
        }
      } catch {
        // Allow the user to remain on the public page.
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};