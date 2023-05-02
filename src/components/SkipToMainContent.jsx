import { useCallback, useRef } from 'react';
import { useTimeoutAction } from '../hooks';
import Button from './shared/Button';

const skipToMainStyles = {
  position: 'absolute',
  left: 'calc(50% - 7.5rem',
  transition: 'all 0.25s ease',
  height: '3.125rem',
  maxHeight: '3.125rem',
  padding: '2.25rem 3rem 1.5rem',
};

const SkipToMainContent = () => {
  const mainContent = useRef(null);

  const clearFalseFocusEffect = useCallback(
    () => mainContent.current?.removeAttribute('tabIndex'),
    []
  );
  const handleTimeout = useTimeoutAction(clearFalseFocusEffect, 1000);

  const handleSkipToMain = useCallback(() => {
    mainContent.current = document?.querySelector('main:first-of-type');
    if (mainContent.current) {
      mainContent.current.tabIndex = -1;
      mainContent.current.focus();
      handleTimeout();
    }
  }, [handleTimeout]);

  return (
    <Button
      id='skip-to-main'
      style={skipToMainStyles}
      onClick={handleSkipToMain}
    >
      Skip to main content
    </Button>
  );
};

export default SkipToMainContent;
