import { User } from "@/types/user";
import type { Note, NoteTag } from "../../types/note";
import { api } from "./api";


export interface NewNoteItem {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface SessionResponse {
  headers: Headers | Record<string, string | string[]>;
  success: boolean;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateMeRequest = {
  username: string;
};

export const fetchNotes = async (
  search: string,
  page: number,
  perPage: number,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const {data} = await api.get<FetchNotesResponse>("/notes", {
    params: { ...(search && { search }), page, perPage, tag },
  });
  return data;
};

export const createNote = async (newNote: NewNoteItem) => {
  const res = await api.post<Note>("/notes", newNote);
  return res.data;
};

export const deleteNote = async (noteId: string) => {
  const res = await api.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export const fetchNoteById = async (noteId: string) => {
  const res = await api.get<Note>(`/notes/${noteId}`);
  return res.data;
};

export const checkSession = async () => {
    const res = await api.get<SessionResponse>(`/auth/session`);
  return res.data;
}

export const getMe = async () => {
    const res = await api.get<User>(`/users/me`);
  return res.data;
}

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<User>('/auth/login', data);
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const updateMe = async (data: UpdateMeRequest) => {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
};