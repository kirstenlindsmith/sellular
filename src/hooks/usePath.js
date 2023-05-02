import { useEffect, useState } from 'react';

export const usePath = () => {
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname
  );

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    onLocationChange();
    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  return currentPath;
};

export default usePath;
