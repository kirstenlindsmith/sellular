import { useEffect } from 'react';
import { colors, frontendRoutes } from '../../../constants';
import { navigate } from '../../../helpers';
import { useItems, useUser } from '../../../hooks';
import Button from '../../shared/Button';
import PlusIcon from '../../../assets/PlusIcon';
import ItemsList from './components/ItemsList';
import './AllItems.css';

const AllItems = () => {
  const { signedIn } = useUser();
  const { addItem } = useItems();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
  }, [signedIn]);

  return (
    <div className='standard-page'>
      <main className='header-row'>
        <h1>All products</h1>
        <Button onClick={addItem}>
          <PlusIcon color={colors.white} size={'1rem'} /> Add
        </Button>
      </main>
      <ItemsList />
    </div>
  );
};

export default AllItems;
