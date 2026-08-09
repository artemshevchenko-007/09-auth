import type { Metadata } from 'next';
import CreateNote from './CreateNote';

export const metadata: Metadata = {
  title: 'NoteHub | Create New Note',
  description: 'Create a new note in NoteHub. Start your efficient way to organise notes now.',
  openGraph: {
    title: `NoteHub | Create New Note`,
    description: `Create a new note in NoteHub. Start your efficient way to organise notes now.`,
    url: `https://08-zustand-seven-ivory.vercel.app/notes/action/create`,
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub',
      },
    ],
    type: 'article',
  },
};

export default function CreateNotePage() {
  return <CreateNote />;
}