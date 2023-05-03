/* eslint-disable no-restricted-globals */
import { useCallback, useMemo } from 'react';
import { colors, frontendRoutes } from '../../constants';
import { usePath, useUser } from '../../hooks';
import ArrowLeftIcon from '../../assets/ArrowLeftIcon';
import Link from '../shared/Link';
import Button from '../shared/Button';
import './AuthBar.css';
import { makeLinkFromName } from '../../helpers';

const routesWithoutBackButton = [
  frontendRoutes.home,
  frontendRoutes.signIn,
  frontendRoutes.signOut,
];

const AuthBar = () => {
  const path = usePath();
  const { signedIn, userName } = useUser();
  const hideBackButton = useMemo(
    () => routesWithoutBackButton.includes(path),
    [path]
  );

  const handleBack = useCallback(() => {
    history?.back();
  }, []);

  return signedIn ? (
    <div className='auth-bar'>
      <div className='main-bar'>
        <div className='sub-section'>
          <Link href={frontendRoutes.home}>All products</Link>
          <Link
            href={`${frontendRoutes.userItems}/${makeLinkFromName(userName)}`}
          >
            My products
          </Link>
        </div>
        <div className='sub-section'>
          <p className='user-name'>Hi, {userName || 'friend'}!</p>
          <Link className='sign-out-link' href={frontendRoutes.signOut}>
            Sign out
          </Link>
        </div>
      </div>
      <Button
        color='transparent'
        onClick={handleBack}
        textColor={colors.teal}
        hidden={hideBackButton}
        className='back-button'
      >
        <ArrowLeftIcon size='0.75rem' color={colors.teal} /> Back
      </Button>
    </div>
  ) : null;
};

export default AuthBar;
