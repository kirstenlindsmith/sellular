/* eslint-disable no-restricted-globals */
import { colors, frontendRoutes } from '../constants';
import { usePath, useUser } from '../hooks';
import ArrowLeftIcon from '../assets/ArrowLeftIcon';
import Link from './shared/Link';
import { useCallback, useMemo } from 'react';
import Button from './shared/Button';

const authBarStyles = {
  position: 'absolute',
  top: 0,
  zIndex: 1000,
  width: '100%',
  padding: '1rem 2rem',
  justifyContent: 'space-between',
};

const authStyles = {
  alignItems: 'flex-start',
  gap: '1rem',
};

const nameStyles = {
  fontSize: '0.875rem',
  maxWidth: '30rem',
  marginTop: '0.125rem',
  wordBreak: 'break-word',
};

const linkStyle = {
  whiteSpace: 'nowrap',
};

const AuthBar = () => {
  const path = usePath();
  const { signedIn, userName } = useUser();
  const showBackButton = useMemo(
    () =>
      path === frontendRoutes.userItems || path.includes(frontendRoutes.item),
    [path]
  );

  const handleBack = useCallback(() => {
    history?.back();
  }, []);

  return signedIn ? (
    <div style={authBarStyles} className='row'>
      <div>
        {showBackButton ? (
          <Button
            onClick={handleBack}
            color='transparent'
            textColor={colors.teal}
          >
            <ArrowLeftIcon size='0.75rem' color={colors.teal} /> Back
          </Button>
        ) : null}
      </div>
      <div style={authStyles} className='row'>
        <p style={nameStyles}>Hi, {userName || 'friend'}!</p>
        <Link href={frontendRoutes.signOut} style={linkStyle}>
          Sign out
        </Link>
      </div>
    </div>
  ) : null;
};

export default AuthBar;
