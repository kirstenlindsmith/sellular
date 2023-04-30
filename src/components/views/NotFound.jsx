import { useCallback } from 'react';
import { frontendRoutes } from '../../constants';
import { navigate } from '../../helpers';
import Button from '../Button';

const headerStyles = {
  fontSize: '1.25rem',
  marginBottom: '2rem',
};

const NotFound = () => {
  const handleReturnHome = useCallback(() => {
    navigate(frontendRoutes.home);
  }, []);

  return (
    <div className='centered-page'>
      <main className='centererd-page-content'>
        <h1 style={headerStyles}>
          Sorry, but the page you're looking for doesn't exist
        </h1>
        <Button fullWidth onClick={handleReturnHome}>
          Return home
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
