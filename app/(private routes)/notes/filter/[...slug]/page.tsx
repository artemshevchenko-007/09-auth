import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const activeTag = slug[0] === 'all' ? undefined : slug[0];
  return {
    title: activeTag ? `${activeTag} | NoteHub` : 'All Notes | NoteHub',
    description: `Filtered notes by tag: ${activeTag ?? 'All notes'}`,
    openGraph: {
      title: `NoteHub`,
      description: `NoteHub is a simple and efficient application designed for managing personal notes. It helps keep your thoughts organized and accessible in one place, whether you are at home or on the go.`,
      url: `https://08-zustand-seven-ivory.vercel.app/${activeTag}`,
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
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const activeTag = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, activeTag],
    queryFn: () => fetchNotes('', 1, 12, activeTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={activeTag} />
    </HydrationBoundary>
  );
}