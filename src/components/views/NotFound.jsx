import { useCallback } from 'react';
import { frontendRoutes } from '../../constants';
import { navigate } from '../../helpers';
import Button from '../shared/Button';

const NotFound = () => {
  const handleReturnHome = useCallback(() => {
    navigate(frontendRoutes.home);
  }, []);

  return (
    <div className='centered-page'>
      <main className='centered-page-content not-found-page'>
        <h1>
          <span className='column center'>
            <span className='not-found-sorry'>Sorry</span>
            <span aria-hidden='true' className='not-found-shrug'>
              ¯\_(ツ)_/¯
            </span>
          </span>
          <br />
          ...the page you're looking for doesn't exist
        </h1>
        <Button fullWidth onClick={handleReturnHome}>
          Return home
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
