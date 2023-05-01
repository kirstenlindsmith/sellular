import { frontendRoutes } from '../constants';
import { useUser } from '../hooks';
import Link from './Link';
import sharedStyles from '../style/shared.styles';

const authBarStyles = {
  ...sharedStyles.row,
  justifyContent: 'flex-end',
  width: '100%',
  padding: '1rem 2rem',
  position: 'fixed',
  top: 0,
  zIndex: 1000,
};

const authStyles = {
  ...sharedStyles.row,
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
  const { signedIn, userName } = useUser();

  return signedIn ? (
    <div style={authBarStyles}>
      <div style={authStyles}>
        <p style={nameStyles}>Hi, {userName || 'friend'}!</p>
        <Link href={frontendRoutes.signOut} style={linkStyle}>
          Sign out
        </Link>
      </div>
    </div>
  ) : null;
};

export default AuthBar;
