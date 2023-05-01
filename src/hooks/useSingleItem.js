import { useContext } from 'react';
import { SingleItemContext } from '../context/singleItemContext';

export const useSingleItem = () => {
  const context = useContext(SingleItemContext);

  if (context === undefined) {
    throw new Error(
      '`useSingleItem` hook must be used within an `SingleItemProvider` component'
    );
  }
  return context;
};

export default useSingleItem;
