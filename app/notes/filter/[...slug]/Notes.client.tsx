'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '@/components/Loader/Loader';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './page.module.css';
import Link from 'next/link';

interface Props {
  tag?: string;
}

function App({ tag }: Props) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const handleSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', query, page, tag],
    queryFn: () => fetchNotes(query, page, 12, tag),
    placeholderData: keepPreviousData,
  });
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChangeSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}

export default App;