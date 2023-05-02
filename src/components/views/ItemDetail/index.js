import { useEffect, useMemo } from 'react';
import { frontendRoutes } from '../../../constants';
import { navigate } from '../../../helpers';
import { useItems, usePath, useUser } from '../../../hooks';
import ItemDetail from './ItemDetail';
import SingleItemProvider from '../../../context/singleItemContext';

const ItemDetailContainer = () => {
  const path = usePath();
  const { signedIn } = useUser();
  const { allItems } = useItems();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
  }, [signedIn]);

  const itemId = useMemo(
    () =>
      path.slice(
        path.indexOf(frontendRoutes.item) + frontendRoutes.item.length + 1
      ) || undefined,
    [path]
  );
  const item = useMemo(
    () => allItems.find((item) => item.id === itemId),
    [allItems, itemId]
  );

  return (
    <SingleItemProvider item={item}>
      <ItemDetail />
    </SingleItemProvider>
  );
};

export default ItemDetailContainer;
