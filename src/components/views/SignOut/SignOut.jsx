import { useEffect } from 'react';
import { frontendRoutes } from '../../../constants';
import { navigate } from '../../../helpers';
import { useItems, useUser } from '../../../hooks';
import sharedStyles from '../../../style/shared.styles';

const SignOut = () => {
  const { setLoading, signedIn, signOut } = useUser();
  const { setUserItems } = useItems();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
    else {
      setLoading(true);
      signOut();
      //clear the user's items so that if the same browser logs in as a different user,
      //they don't risk seeing the wrong user items
      setUserItems([]);
    }
  }, [setLoading, setUserItems, signOut, signedIn]);

  return (
    <div
      className='centered-page'
      style={sharedStyles.pageConlightBluePagetainer}
    />
  );
};

export default SignOut;
