import { useCallback, useEffect, useMemo, useState } from 'react';
import { breakpoints, colors } from '../../../../constants';
import { makeRowGroups } from '../../../../helpers';
import { useItems } from '../../../../hooks';
import PageLoader from '../../../PageLoader';
import SingleItem from './SingleItem';
import SingleItemProvider from '../../../../context/singleItemContext';

const ItemsList = () => {
  const { allItems, loading } = useItems();

  const [itemsPerRow, setItemsPerRow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window?.innerWidth ?? breakpoints.small;
      if (windowWidth <= breakpoints.mobile) {
        setItemsPerRow(1);
      } else if (windowWidth <= breakpoints.small) {
        setItemsPerRow(3);
      } else if (windowWidth <= breakpoints.large) {
        setItemsPerRow(4);
      } else {
        setItemsPerRow(5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groupedItems = useMemo(
    () => makeRowGroups(allItems, itemsPerRow),
    [allItems, itemsPerRow]
  );
  const noItems = useMemo(
    () => !allItems.length && !loading,
    [allItems, loading]
  );

  const Items = useCallback(
    () =>
      noItems ? (
        <p>No products are currently available.</p>
      ) : (
        groupedItems.map((group) => (
          <div key={`item-group-${Math.random()}`} className='item-group'>
            {(group ?? []).map((item) => {
              const isPlaceholder = item === 'placeholder';
              return isPlaceholder ? (
                <div
                  key={Math.random()}
                  className='single-item placeholder-item'
                />
              ) : (
                <SingleItemProvider key={item.id} item={item}>
                  <SingleItem />
                </SingleItemProvider>
              );
            })}
          </div>
        ))
      ),
    [groupedItems, noItems]
  );

  return (
    <div className='items-list'>
      {loading ? (
        <PageLoader style={{ backgroundColor: colors.white }} />
      ) : (
        <Items />
      )}
    </div>
  );
};

export default ItemsList;
