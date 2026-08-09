'use client';
import css from './NoteForm.module.css';
import { ChangeEvent, useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import type { NoteFormValues, NoteTag } from '@/types/note';
import { useRouter } from 'next/navigation';
import { useDraftStore } from '@/lib/store/noteStore';

export default function NoteForm() {
  const { draft, clearDraft, setDraft } = useDraftStore();
  const fieldId = useId();
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({ ...draft, [e.target.name]: e.target.value });
  };
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = async (action: FormData) => {
    const newNote: NoteFormValues = {
      title: action.get('title') as string,
      content: action.get('content') as string,
      tag: action.get('tag') as NoteTag,
    };
    await mutateAsync(newNote);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}> Title</label>
        <input
          type="text"
          id={`${fieldId}-title`}
          name="title"
          required
          minLength={3}
          maxLength={50}
          defaultValue={draft.title}
          onChange={handleChange}
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          maxLength={500}
          defaultValue={draft.content}
          onChange={handleChange}
          className={css.textarea}
        ></textarea>
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          required
          defaultValue={draft.tag ?? 'Todo'}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}