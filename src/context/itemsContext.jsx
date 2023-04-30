import { createContext, useCallback, useEffect, useState } from 'react';
import { backendRoutes, storageKeys } from '../constants';
import {
  filterOutTarget,
  getArrayItem,
  setArrayItem,
  setItemAttributes,
} from '../helpers';
import { useTimeoutAction, useUser } from '../hooks';
import Item from '../models/Item';

const initialValue = {
  userItems: [],
  allItems: [],
  loading: false,
  addItem: () => undefined,
  saveItem: () => undefined,
  removeItem: () => undefined,
};

export const ItemsContext = createContext(initialValue);

const ItemsProvider = ({ children }) => {
  const { userName } = useUser();
  const [loading, setLoading] = useState(false);
  const [userItems, setUserItems] = useState(() =>
    getArrayItem(storageKeys.userItems)
  );
  const [allItems, setAllItems] = useState(() =>
    getArrayItem(storageKeys.allItems)
  );

  const resetLoadingState = useCallback(() => setLoading(false), []);
  //spoofed delay to show my cute loader :)
  const resetLoadingStateAfterDelay = useTimeoutAction(resetLoadingState, 1000);

  const fetchRemoteItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(backendRoutes.items);
      const data = await response.json();
      setLoading(false);
      return data?.items ?? [];
    } catch (error) {
      setLoading(false);
      console.error(
        `${error?.message || 'Error'}: ${error || '(details unknown)'}`
      );
    }
  }, []);

  useEffect(() => {
    //pull remote items if needed
    if (!allItems.length || userItems.length === allItems.length) {
      fetchRemoteItems().then((items) => {
        const newItems = [...userItems, ...items];
        setAllItems(newItems);
        setArrayItem(storageKeys.allItems, newItems);
      });
    }
  }, [allItems.length, fetchRemoteItems, userItems]);

  const addItem = useCallback(() => {
    const NewItem = new Item();
    NewItem.id = crypto.randomUUID();
    NewItem.author = userName;
    setUserItems((current) => [NewItem, ...current]);
    setAllItems((current) => [NewItem, ...current]);
    setArrayItem(storageKeys.userItems, [
      NewItem,
      ...getArrayItem(storageKeys.userItems),
    ]);
    setArrayItem(storageKeys.allItems, [
      NewItem,
      ...getArrayItem(storageKeys.allItems),
    ]);
  }, [userName]);

  const saveItem = useCallback(
    (newItem) => {
      setLoading(true);
      const newUserItems = userItems.map(setItemAttributes(newItem));
      const newAllItems = allItems.map(setItemAttributes(newItem));
      setUserItems(newUserItems);
      setAllItems(newAllItems);
      setArrayItem(storageKeys.userItems, newUserItems);
      setArrayItem(storageKeys.allItems, newAllItems);
      resetLoadingStateAfterDelay();
    },
    [allItems, resetLoadingStateAfterDelay, userItems]
  );

  const removeItem = useCallback(
    (targetItem) => {
      setLoading(true);
      const newUserItems = userItems.filter(filterOutTarget(targetItem.id));
      const newAllItems = allItems.filter(filterOutTarget(targetItem.id));
      setUserItems(newUserItems);
      setAllItems(newAllItems);
      setArrayItem(storageKeys.userItems, newUserItems);
      setArrayItem(storageKeys.allItems, newAllItems);
      resetLoadingStateAfterDelay();
    },
    [allItems, resetLoadingStateAfterDelay, userItems]
  );

  return (
    <ItemsContext.Provider
      value={{
        userItems,
        allItems,
        loading,
        addItem,
        saveItem,
        removeItem,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export default ItemsProvider;
