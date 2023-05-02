import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { backendRoutes, storageKeys } from '../constants';
import {
  filterOutTarget,
  getArrayItem,
  getLoaderDisplayTime,
  setArrayItem,
  setItemAttributes,
} from '../helpers';
import { useTimeoutAction, useUser } from '../hooks';
import Item from '../models/Item';

const initialValue = {
  userItems: [],
  allItems: [],
  loadingItemIds: [],
  loading: false,
  addItem: () => undefined,
  saveItem: () => undefined,
  removeItem: () => undefined,
  setUserItems: () => undefined,
};

export const ItemsContext = createContext(initialValue);

const ItemsProvider = ({ children }) => {
  const { userName } = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingItemIds, setLoadingItemIds] = useState([]);
  const [userItems, setUserItems] = useState(() =>
    getArrayItem(storageKeys.userItems)
  );
  const [allItems, setAllItems] = useState(() =>
    getArrayItem(storageKeys.allItems)
  );

  const hasUserItems = useMemo(
    () =>
      !!userItems.length || allItems.some((item) => item.author === userName),
    [allItems, userItems.length, userName]
  );

  const resetLoadingState = useCallback(() => setLoading(false), []);
  const resetLoadingIdState = useCallback((loadingId, afterLoad) => {
    setLoadingItemIds((current) => current.filter((id) => id !== loadingId));
    afterLoad?.();
  }, []);
  //spoofed delays to show my cute loader :)
  const loaderTime = getLoaderDisplayTime();
  const resetLoadingStateAfterDelay = useTimeoutAction(
    resetLoadingState,
    loaderTime
  );
  const resetLoadingIdsAfterDelay = useTimeoutAction(
    resetLoadingIdState,
    loaderTime
  );

  const fetchRemoteItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(backendRoutes.items);
      const data = await response.json();
      resetLoadingStateAfterDelay();
      return data?.items ?? [];
    } catch (error) {
      setLoading(false);
      console.error(
        `${error?.message || 'Error'}: ${error || '(details unknown)'}`
      );
    }
  }, [resetLoadingStateAfterDelay]);

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

  useEffect(() => {
    //populate user's own items if needed
    if (!userItems.length && hasUserItems) {
      setUserItems(allItems.filter((item) => item.author === userName));
    }
  }, [allItems, hasUserItems, userItems.length, userName]);

  const addItem = useCallback(() => {
    const NewItem = new Item();
    NewItem.id = crypto.randomUUID();
    NewItem.author = userName;
    NewItem.unsaved = true; //temporary flag
    setUserItems((current) => [NewItem, ...current]);
    setAllItems((current) => [NewItem, ...current]);
  }, [userName]);

  const saveItem = useCallback(
    (newItem) => {
      newItem.unsaved = false; //toggle temporary flag;
      setLoadingItemIds((current) => [...current, newItem.id]);
      const newUserItems = userItems.map(setItemAttributes(newItem));
      const newAllItems = allItems.map(setItemAttributes(newItem));
      setUserItems(newUserItems);
      setAllItems(newAllItems);
      setArrayItem(storageKeys.userItems, newUserItems);
      setArrayItem(storageKeys.allItems, newAllItems);
      delete newItem.unsaved; //delete temporary flag
      resetLoadingIdsAfterDelay(newItem.id);
    },
    [allItems, resetLoadingIdsAfterDelay, userItems]
  );

  const removeItem = useCallback(
    (targetItemId) => {
      if (!targetItemId) return;
      setLoadingItemIds((current) => [...current, targetItemId]);
      const newUserItems = userItems.filter(filterOutTarget(targetItemId));
      const newAllItems = allItems.filter(filterOutTarget(targetItemId));
      const handleDeleteAfterLoad = () => {
        setUserItems(newUserItems);
        setAllItems(newAllItems);
        setArrayItem(storageKeys.userItems, newUserItems);
        setArrayItem(storageKeys.allItems, newAllItems);
      };
      resetLoadingIdsAfterDelay(targetItemId, handleDeleteAfterLoad);
    },
    [allItems, resetLoadingIdsAfterDelay, userItems]
  );

  return (
    <ItemsContext.Provider
      value={{
        userItems,
        setUserItems,
        allItems,
        loading,
        loadingItemIds,
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
