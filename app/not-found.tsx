import React from 'react';
import css from './Home.module.css';
import type { Metadata } from 'next';

const NotFoundPage = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFoundPage;

export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: `404 - Page not found | NoteHub`,
    description: `Sorry, the page you are looking for does not exist.`,
    url: `https://08-zustand-seven-ivory.vercel.app`,
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