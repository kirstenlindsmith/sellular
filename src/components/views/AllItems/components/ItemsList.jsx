import { useCallback, useMemo } from 'react';
import { colors } from '../../../../constants';
import { makeGroupsOfThree } from '../AllItems.helpers';
import {
  useItems,
  useOverflowWatcher,
  usePageWrapWatcher,
} from '../../../../hooks';
import Button from '../../../Button';
import PageLoader from '../../../PageLoader';
import PlusIcon from '../../../../assets/PlusIcon';

const ItemsList = () => {
  const { addItem, allItems, loading } = useItems();
  const { pageWraps, containerRef } = usePageWrapWatcher();
  const { componentRef, overflows: headerOverflows } = useOverflowWatcher();

  const headerStyles = useMemo(
    () => ({ overflow: headerOverflows ? 'auto' : 'visible' }),
    [headerOverflows]
  );
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
        groupedItems.map((group, groupIndex) => (
          <div
            key={`item-group-${Math.random()}`}
            id={`item-group-${groupIndex}`}
            className='item-group'
            style={listStyles}
          >
            {(group ?? []).map((item, itemIndex) => {
              const isPlaceholder = item === 'placeholder';
              return isPlaceholder ? (
                <div
                  key={Math.random()}
                  id={`item-${groupIndex}-${itemIndex}`}
                  className='single-item placeholder-item'
                />
              ) : (
                <div
                  key={item.id}
                  id={`item-${groupIndex}-${itemIndex}`}
                  className='single-item'
                >
                  {item.title || 'item'}
                  <br />
                  {item.id || 'id'}
                </div>
              );
            })}
          </div>
        ))
      ),
    [groupedItems, listStyles, noItems]
  );

  return (
    <div>
      <div className='header-row' ref={componentRef} style={headerStyles}>
        <h1>All products</h1>
        <Button size='small' onClick={addItem}>
          <PlusIcon color={colors.white} size={'1rem'} /> Add
        </Button>
      </div>
      <div className='items-list' ref={containerRef}>
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
