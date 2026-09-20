import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'cookie';
import { AxiosResponse } from 'axios';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

const setServerCookies = (
  response: NextResponse,
  axiosRes: AxiosResponse
): boolean => {
  const setCookie = axiosRes.headers['set-cookie'];

  if (!setCookie) return false;

  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const cookieStr of cookieArray) {
    const parsed = parseSetCookie(cookieStr);

    if (parsed.value === undefined) {
      continue;
    }

    response.cookies.set(parsed.name, parsed.value, {
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      path: parsed.Path || '/',
      maxAge: parsed['Max-Age']
        ? Number(parsed['Max-Age'])
        : undefined,
    });
  }

  return true;
};

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const isPrivate = privateRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(route + '/')
  );

  const isPublic = publicRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(route + '/')
  );

  const cookiesStore = await cookies();

  const accessToken = cookiesStore.get('accessToken')?.value;
  const refreshToken = cookiesStore.get('refreshToken')?.value;

  if (isPrivate) {
    if (!accessToken) {
      if (refreshToken) {
        try {
          const authRes = await checkSession();

          const response = NextResponse.next();

          const isAuth = setServerCookies(response, authRes);

          if (isAuth) {
            return response;
          }

          return NextResponse.redirect(
            new URL('/sign-in', origin)
          );
        } catch {
          return NextResponse.redirect(
            new URL('/sign-in', origin)
          );
        }
      }

      return NextResponse.redirect(
        new URL('/sign-in', origin)
      );
    }
  }

  if (isPublic) {
    if (accessToken) {
      return NextResponse.redirect(
        new URL('/', origin)
      );
    }

    if (refreshToken) {
      try {
        const authRes = await checkSession();

        const response = NextResponse.redirect(
          new URL('/', origin)
        );

        const isAuth = setServerCookies(response, authRes);

        if (isAuth) {
          return response;
        }

        return NextResponse.next();
      } catch {
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};