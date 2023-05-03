import { useCallback, useRef } from 'react';
import { useTimeoutAction } from '../hooks';
import Button from './shared/Button';

//NOTE: allows for user to immediately tab to the <main> of a page for accessibility
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
    <Button id='skip-to-main' onClick={handleSkipToMain}>
      Skip to main content
    </Button>
  );
};

export default SkipToMainContent;
