import { createContext, useCallback, useEffect, useState } from 'react';
import { backendRoutes, frontendRoutes, storageKeys } from '../constants';
import {
  filterOutTarget,
  getArrayItem,
  getItem,
  getLoaderDisplayTime,
  navigate,
  setArrayItem,
  setItem,
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
  handleLogoutItemRefresh: () => undefined,
};

export const ItemsContext = createContext(initialValue);

const ItemsProvider = ({ children }) => {
  const { userName } = useUser();

  const [loading, setLoading] = useState(false);
  const [loadingItemIds, setLoadingItemIds] = useState([]);
  const [allItems, setAllItems] = useState(() =>
    getArrayItem(storageKeys.allItems)
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
      setItem(storageKeys.fetchedApi, 'true');
      resetLoadingStateAfterDelay();
      return data?.items ?? [];
    } catch (error) {
      setLoading(false);
      console.error(
        `Something went wrong — ${error?.message || 'Error'}: ${
          error || '(details unknown)'
        }`
      );
    }
  }, [resetLoadingStateAfterDelay]);

  useEffect(() => {
    //pull remote items if needed
    //NOTE: this works even if an offline user adds a custom item, then connects to the internet lol
    if (!getItem(storageKeys.fetchedApi) && navigator.onLine) {
      fetchRemoteItems().then((items) => {
        const itemIds = new Set();
        const existingItems = getArrayItem(storageKeys.allItems);
        const newItems = [...existingItems, ...(items ?? [])].filter((item) => {
          //make sure to never allow duplicates
          if (!itemIds.has(item.id)) {
            itemIds.add(item.id);
            return true;
          } else return false;
        });
        setAllItems(newItems);
        setArrayItem(storageKeys.allItems, newItems);
      });
    }
  }, [allItems.length, fetchRemoteItems]);

  const addItem = useCallback(() => {
    const NewItem = new Item();
    NewItem.id = crypto.randomUUID();
    NewItem.author = userName;
    NewItem.unsaved = true; //temporary flag
    setAllItems((current) => [NewItem, ...current]);
  }, [userName]);

  const saveItem = useCallback(
    (newItem) => {
      newItem.unsaved = false; //toggle temporary flag;
      setLoadingItemIds((current) => [...current, newItem.id]);
      const newAllItems = allItems.map(setItemAttributes(newItem));
      setAllItems(newAllItems);
      setArrayItem(storageKeys.allItems, newAllItems);
      delete newItem.unsaved; //delete temporary flag
      resetLoadingIdsAfterDelay(newItem.id);
    },
    [allItems, resetLoadingIdsAfterDelay]
  );

  const removeItem = useCallback(
    (targetItemId, fromDetailPage = false) => {
      if (!targetItemId) return;
      setLoadingItemIds((current) => [...current, targetItemId]);
      const newAllItems = allItems.filter(filterOutTarget(targetItemId));
      const handleDeleteAfterLoad = () => {
        if (fromDetailPage) navigate(frontendRoutes.home);
        setAllItems(newAllItems);
        setArrayItem(storageKeys.allItems, newAllItems);
      };
      resetLoadingIdsAfterDelay(targetItemId, handleDeleteAfterLoad);
    },
    [allItems, resetLoadingIdsAfterDelay]
  );

  /*NOTE: clear the user's items so that if the same browser logs in as a different user,
  they don't risk seeing the wrong user items. Also removes any unsaved items still in edit mode*/
  const handleLogoutItemRefresh = useCallback(() => {
    setAllItems((current) => current.filter((item) => !item.unsaved));
  }, []);

  return (
    <ItemsContext.Provider
      value={{
        allItems,
        loading,
        loadingItemIds,
        addItem,
        saveItem,
        removeItem,
        handleLogoutItemRefresh,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export default ItemsProvider;
