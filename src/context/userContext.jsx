import { createContext, useCallback, useEffect, useState } from 'react';
import { frontendRoutes, storageKeys } from '../constants';
import { getItem, navigate, setItem } from '../helpers';

const initialValue = {
  loading: false,
  signedIn: false,
  userName: '',
  signIn: () => undefined,
  signOut: () => undefined,
};

export const UserContext = createContext(initialValue);

const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(() => getItem(storageKeys.userName));

  useEffect(() => {
    if (!userName) {
      setLoading(true);
      const storedUser = getItem(storageKeys.userName);
      !!storedUser && setUserName(storedUser);
      setLoading(false);
    }
  }, [userName]);

  const signIn = useCallback((newUserName) => {
    setUserName(newUserName);
    setItem(storageKeys.userName, newUserName);
    navigate(frontendRoutes.home);
  }, []);

  const signOut = useCallback(() => {
    navigate(frontendRoutes.signOut);
  }, []);

  return (
    <UserContext.Provider
      value={{
        loading,
        signedIn: !!userName,
        userName,
        signIn,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
