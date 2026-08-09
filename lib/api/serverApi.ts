import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import type { AxiosResponse } from 'axios';
import type { Note } from '@/types/note';
import type { SessionResponse } from './clientApi';
import type { User } from '@/types/user';
import { api } from './api';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page: number,
  perPage: number,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: { ...(search && { search }), page, perPage, tag },
    headers: { Cookie: cookieStore.toString() },
  });

  return data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const cookieStore = await cookies();

  const { data } = await api.get<Note>(`/notes/${noteId}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  return data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();

  const response = await api.get<SessionResponse>('/auth/session', {
    headers: { Cookie: cookieStore.toString() },
  });

  return response;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const { data } = await api.get<User>('/users/me', {
    headers: { Cookie: cookieStore.toString() },
  });

  return data;
};

export const setServerCookies = async (
  response: AxiosResponse,
): Promise<boolean> => {
  const cookieStore = await cookies();
  const setCookie = response.headers['set-cookie'];

  if (!setCookie) {
    return false;
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

  return true;
};