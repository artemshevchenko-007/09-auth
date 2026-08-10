import { Note } from '@/types/note';
import { api } from './api';
import { cookies } from 'next/headers';
import { SessionResponse } from './clientApi';
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';
import { parse } from 'cookie';


export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (
    search: string,
    page: number,
    perPage: number,
    tag?: string
): Promise<FetchNotesResponse> => {
    const cookieStore = await cookies();
    const { data } = await api.get<FetchNotesResponse>('/notes', {
        params: { ...(search && { search }), page, perPage, tag },
        headers: { Cookie: cookieStore.toString() },
    });
    return data;
};

export const fetchNoteById = async (noteId: string) => {
    const cookieStore = await cookies();
    const res = await api.get<Note>(`/notes/${noteId}`, {
        headers: { Cookie: cookieStore.toString() },
    });
    return res.data;
};

export const checkSession = async () => {
    const cookieStore = await cookies();
    const res = await api.get<SessionResponse>(`/auth/session`, {
        headers: { Cookie: cookieStore.toString() },
    });
    return res;
};

export const getMe = async (): Promise<User> => {
    const cookieStore = await cookies();
    const { data } = await api.get('/users/me', {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return data;
};

export const setServerCookies = async (response: AxiosResponse): Promise<boolean> => {
  const cookieStore = await cookies();
  const setCookie = response.headers['set-cookie'];

  if (setCookie) {
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
    for (const cookieStr of cookieArray) {
      const parsed = parse(cookieStr);
      const options = {
        expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
        path: parsed.Path,
        maxAge: Number(parsed['Max-Age']),
      };
      if (parsed.accessToken) cookieStore.set('accessToken', parsed.accessToken, options);
      if (parsed.refreshToken) cookieStore.set('refreshToken', parsed.refreshToken, options);
    }
    return true;
  }
  return false;
};