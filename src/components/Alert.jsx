//React Alert with tailwind
import React, { useEffect } from 'react';

function Alert({ type, message, status, setAlert }) {
  useEffect(() => {
    if (status) {
      setTimeout(() => {
        setAlert((alert) => ({ ...alert, status: false }));
      }, 3000);
    }
  }, [status, setAlert]);

  return (
    <>
      {status && (
        <div
          className={`float top-4 left-1/2 p-4 mb-4  max-w-sm truncate text-sm text-${
            type === 'success' ? 'green' : 'red'
          }-100 bg-${type === 'success' ? 'green' : 'red'}-800 rounded-lg  `}
          role="alert">
          {message}
        </div>
      )}
    </>
  );
}

export default Alert;
