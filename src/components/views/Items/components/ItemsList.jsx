import { useCallback, useEffect, useMemo, useState } from 'react';
import { breakpoints } from '../../../../constants';
import { makeRowGroups } from '../../../../helpers';
import { useItems, useUser } from '../../../../hooks';
import NoItems from './NoItems';
import PageLoader from '../../../PageLoader';
import SingleItem from './SingleItem';
import SingleItemProvider from '../../../../context/singleItemContext';

const ItemsList = ({ pageUserName }) => {
  const { userName } = useUser();
  const { allItems, loading } = useItems();

  const [itemsPerRow, setItemsPerRow] = useState(3);

  //handle row size based on window width
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window?.innerWidth ?? breakpoints.medium;
      if (windowWidth <= breakpoints.mobile) {
        setItemsPerRow(1);
      } else if (windowWidth <= breakpoints.small) {
        setItemsPerRow(2);
      } else if (windowWidth <= breakpoints.large) {
        setItemsPerRow(3);
      } else if (windowWidth <= breakpoints.xLarge) {
        setItemsPerRow(4);
      } else {
        setItemsPerRow(5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const myItems = useMemo(
    () => pageUserName === userName,
    [pageUserName, userName]
  );
  const someoneElsesItems = useMemo(
    () => !!pageUserName && !myItems,
    [myItems, pageUserName]
  );
  const filteredItems = useMemo(() => {
    if (!!pageUserName) {
      return allItems.filter((item) => item.author === pageUserName);
    } else return allItems;
  }, [allItems, pageUserName]);
  const groupedItems = useMemo(
    () => makeRowGroups(filteredItems, itemsPerRow),
    [filteredItems, itemsPerRow]
  );
  const noItems = useMemo(
    () => !filteredItems.length && !loading,
    [filteredItems.length, loading]
  );

  const Items = useCallback(
    () =>
      noItems ? (
        <NoItems myItems={myItems} userItems={someoneElsesItems} />
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
                <SingleItemProvider key={item?.id ?? Math.random()} item={item}>
                  <SingleItem />
                </SingleItemProvider>
              );
            })}
          </div>
        ))
      ),
    [groupedItems, myItems, noItems, someoneElsesItems]
  );

  return (
    <div className='items-list'>{loading ? <PageLoader /> : <Items />}</div>
  );
};

export default ItemsList;
