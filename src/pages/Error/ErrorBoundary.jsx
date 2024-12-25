import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();

  console.log(error)

  return (
    <div>
      <h1>Error {error.status}</h1>
      <p>{error.statusText || error.message || error.data}</p>
    </div>
  );
};

export default ErrorBoundary;
