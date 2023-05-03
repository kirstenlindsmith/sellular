import { useEffect, useState } from 'react';

//NOTE: custom replacement for react routing.
//allows react render lifecycle to access route change events
export const usePath = () => {
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname
  );

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange); //listen for routing events
    onLocationChange();
    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  return currentPath;
};

export default usePath;
