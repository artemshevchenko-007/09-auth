import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { parseSetCookie } from 'cookie';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (!setCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

    for (const cookieString of cookieArray) {
      const parsed = parseSetCookie(cookieString);

      const options = {
        expires: parsed.expires,
        path: parsed.path,
        maxAge: parsed.maxAge,
      };

      if (parsed.name === 'accessToken' && parsed.value !== undefined) {
        cookieStore.set('accessToken', parsed.value, options);
      }

      if (parsed.name === 'refreshToken' && parsed.value !== undefined) {
        cookieStore.set('refreshToken', parsed.value, options);
      }
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      return NextResponse.json(
        {
          error:
            error.response?.data?.error ??
            error.response?.data?.message ??
            error.message,
        },
        { status: error.response?.status ?? 500 },
      );
    }

    logErrorResponse({ message: (error as Error).message });

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}