import { useContext } from 'react';
import { UserContext } from '../context/userContext';

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error(
      '`useUser` hook must be used within an `UserProvider` component'
    );
  }
  return context;
};

export default useUser;
