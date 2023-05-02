import { useCallback } from 'react';
import { frontendRoutes } from '../../constants';
import { navigate } from '../../helpers';
import Button from '../shared/Button';
import sharedStyles from '../../style/shared.styles';

const pageContentStyles = {
  maxWidth: 'max-content',
};
const shrugStyles = {
  fontSize: '2rem',
  textAlign: 'center',
  fontWeight: 'bold',
};
const headerStyles = {
  fontSize: '1.25rem',
  marginBottom: '2rem',
};
const sorryStyles = {
  fontSize: '5rem',
};

const NotFound = () => {
  const handleReturnHome = useCallback(() => {
    navigate(frontendRoutes.home);
  }, []);

  return (
    <div className='centered-page' style={sharedStyles.lightBluePage}>
      <main className='centered-page-content' style={pageContentStyles}>
        <h1 style={headerStyles}>
          <span className='column center'>
            <span style={sorryStyles}>Sorry</span>
            <span aria-hidden='true' style={shrugStyles}>
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
