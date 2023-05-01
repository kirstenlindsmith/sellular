import { useContext } from 'react';
import { ItemsContext } from '../context/itemsContext';

export const useItems = () => {
  const context = useContext(ItemsContext);

  if (context === undefined) {
    throw new Error(
      '`useItems` hook must be used within an `ItemsProvider` component'
    );
  }
  return context;
};

export default useItems;
