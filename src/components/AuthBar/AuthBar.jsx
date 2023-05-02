/* eslint-disable no-restricted-globals */
import { useCallback, useMemo } from 'react';
import { colors, frontendRoutes } from '../../constants';
import { usePath, useUser } from '../../hooks';
import ArrowLeftIcon from '../../assets/ArrowLeftIcon';
import Link from '../shared/Link';
import Button from '../shared/Button';
import './AuthBar.css';

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
    <div className='auth-bar'>
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
      <div className='auth-section'>
        <p className='user-name'>Hi, {userName || 'friend'}!</p>
        <Link className='sign-out-link' href={frontendRoutes.signOut}>
          Sign out
        </Link>
      </div>
    </div>
  ) : null;
};

export default AuthBar;
