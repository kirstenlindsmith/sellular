import { useEffect } from 'react';

//helps keep the doc height stable in mobile browsers
export const useDocumentHeight = () => {
  useEffect(() => {
    const getDocumentHeight = () => {
      const doc = document.documentElement;
      const docHeight = window.innerHeight;
      doc?.style.setProperty(
        '--document-height',
        docHeight ? `${docHeight}px` : '100%'
      );
    };
    getDocumentHeight();
    window.addEventListener('resize', getDocumentHeight);
    return () => window.removeEventListener('resize', getDocumentHeight);
  }, []);
};
