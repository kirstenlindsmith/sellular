import { useCallback, useMemo } from 'react';
import { colors } from '../../../../constants';
import { makeGroupsOfThree } from '../AllItems.helpers';
import { useItems, usePageWrapWatcher } from '../../../../hooks';
import PageLoader from '../../../PageLoader';
import SingleItem from './SingleItem';
import SingleItemProvider from '../../../../context/singleItemContext';

const ItemsList = () => {
  const { allItems, loading } = useItems();
  const { pageWraps, containerRef } = usePageWrapWatcher();

  const listStyles = useMemo(
    () => ({ flexDirection: pageWraps ? 'column' : 'row' }),
    [pageWraps]
  );
  const groupedItems = useMemo(() => makeGroupsOfThree(allItems), [allItems]);
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
          <div
            key={`item-group-${Math.random()}`}
            className='item-group'
            style={listStyles}
          >
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
    [groupedItems, listStyles, noItems]
  );

  return (
    <div className='items-list' ref={containerRef}>
      <div className='scroll-container'>
        {loading ? (
          <PageLoader style={{ backgroundColor: colors.white }} />
        ) : (
          <Items />
        )}
      </div>
    </div>
  );
};

export default ItemsList;
