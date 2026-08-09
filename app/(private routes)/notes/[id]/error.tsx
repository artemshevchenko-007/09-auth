'use client';

interface ErrorPageProps {
  error: Error;
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  return <p>Could not fetch note details. {error.message}</p>;
};

export default ErrorPage;