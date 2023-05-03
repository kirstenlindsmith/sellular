import { useEffect } from 'react';
import { frontendRoutes } from '../../../constants';
import { navigate } from '../../../helpers';
import { useItems, useUser } from '../../../hooks';

const SignOut = () => {
  const { setLoading, signedIn, signOut } = useUser();
  const { handleLogoutItemRefresh } = useItems();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
    else {
      setLoading(true);
      signOut();
      handleLogoutItemRefresh();
    }
  }, [handleLogoutItemRefresh, setLoading, signOut, signedIn]);

  return <div className='centered-page' />;
};

export default SignOut;
