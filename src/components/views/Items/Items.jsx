import { useEffect, useMemo } from 'react';
import { colors, frontendRoutes } from '../../../constants';
import { makeNameFromLink, navigate, possessiveName } from '../../../helpers';
import { useItems, usePath, useUser } from '../../../hooks';
import Button from '../../shared/Button';
import PlusIcon from '../../../assets/PlusIcon';
import ItemsList from './components/ItemsList';
import './Items.css';

const Items = () => {
  const path = usePath();
  const { signedIn, userName } = useUser();
  const { addItem } = useItems();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
  }, [signedIn]);

  const pageUserName = useMemo(
    () =>
      makeNameFromLink(
        path.slice(
          path.indexOf(frontendRoutes.userItems) +
            frontendRoutes.userItems.length +
            1
        )
      ) || undefined,
    [path]
  );
  const showMyItems = useMemo(
    () => !!pageUserName && pageUserName === userName,
    [pageUserName, userName]
  );
  const pageHeader = useMemo(() => {
    if (!!pageUserName) {
      return showMyItems
        ? 'My products'
        : `${possessiveName(pageUserName)} products`;
    } else return 'All products';
  }, [pageUserName, showMyItems]);

  return (
    <div className='standard-page'>
      <main className='header-row'>
        <h1>{pageHeader}</h1>
        <Button onClick={addItem}>
          <PlusIcon color={colors.white} /> Add
        </Button>
      </main>
      <ItemsList pageUserName={pageUserName} />
    </div>
  );
};

export default Items;
