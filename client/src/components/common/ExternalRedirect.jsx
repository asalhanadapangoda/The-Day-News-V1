import { useEffect } from 'react';

const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  );
};

export default ExternalRedirect;

