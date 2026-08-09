import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${NOTEHUB_TOKEN}`;

export interface NewNoteItem {
  title: string;
  content: string;
  tag: NoteTag;
}

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
  const {data} = await axios.get<FetchNotesResponse>("/notes", {
    params: { ...(search && { search }), page, perPage, tag },
  });
  return data;
};

export const createNote = async (newNote: NewNoteItem) => {
  const res = await axios.post<Note>("/notes", newNote);
  return res.data;
};

export const deleteNote = async (noteId: string) => {
  const res = await axios.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export const fetchNoteById = async (noteId: string) => {
  const res = await axios.get<Note>(`/notes/${noteId}`);
  return res.data;
};