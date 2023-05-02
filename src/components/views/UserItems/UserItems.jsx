import { useEffect, useMemo } from 'react';
import { colors, frontendRoutes } from '../../../constants';
import { navigate } from '../../../helpers';
import { useItems, useOverflowWatcher, useUser } from '../../../hooks';
import Button from '../../shared/Button';
import PlusIcon from '../../../assets/PlusIcon';
import ItemsList from './components/ItemsList';
// import './AllItems.css';

const UserItems = () => {
  const { signedIn } = useUser();
  const { addItem } = useItems();
  const { componentRef, overflows: headerOverflows } = useOverflowWatcher();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
  }, [signedIn]);

  const headerStyles = useMemo(
    () => ({ overflow: headerOverflows ? 'auto' : 'visible' }),
    [headerOverflows]
  );

  return (
    <div className='standard-page'>
      <main className='header-row' ref={componentRef} style={headerStyles}>
        <h1>My products</h1>
        <Button onClick={addItem}>
          <PlusIcon color={colors.white} size={'1rem'} /> Add
        </Button>
      </main>
      <ItemsList />
    </div>
  );
};

export default UserItems;
