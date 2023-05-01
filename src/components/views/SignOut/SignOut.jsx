import { useEffect } from 'react';
import { frontendRoutes } from '../../../constants';
import { navigate } from '../../../helpers';
import { useUser } from '../../../hooks';
import sharedStyles from '../../../style/shared.styles';

const SignOut = () => {
  const { setLoading, signedIn, signOut } = useUser();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
    else {
      setLoading(true);
      signOut();
    }
  }, [setLoading, signOut, signedIn]);

  return (
    <div
      className='centered-page'
      style={sharedStyles.pageConlightBluePagetainer}
    />
  );
};

export default SignOut;
