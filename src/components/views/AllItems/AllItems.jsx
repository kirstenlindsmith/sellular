import { useEffect } from 'react';
import { frontendRoutes } from '../../../constants';
import { navigate } from '../../../helpers';
import { useUser } from '../../../hooks';
import ItemsList from './components/ItemsList';
import sharedStyles from '../../../style/shared.styles';
import './AllItems.css';

const AllItems = () => {
  const { signedIn } = useUser();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
  }, [signedIn]);

  return (
    <div
      className='standard-page fixed-page'
      style={sharedStyles.lightBluePage}
    >
      <ItemsList />
    </div>
  );
};

export default AllItems;
