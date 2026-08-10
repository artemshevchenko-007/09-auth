import type { NoteTag } from '@/types/note';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface DraftNote {
    title: string;
    content: string;
    tag: NoteTag;
}
interface DraftNoteStore {
  draft: DraftNote;
  setDraft: (draft:DraftNote) => void;
  clearDraft: () => void;
}

export const initialDraft:DraftNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useDraftStore = create<DraftNoteStore>()(
  persist
    ((set) => ({
        draft:initialDraft,
        setDraft: (draft:DraftNote) => set({ draft }),
        clearDraft: () => set({draft:initialDraft})
}), {name:'Draft-note', partialize: (state) => ({ draft: state.draft })}))
// 
// 