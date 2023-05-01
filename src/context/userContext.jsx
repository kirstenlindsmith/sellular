import { createContext, useCallback, useEffect, useState } from 'react';
import { frontendRoutes, storageKeys } from '../constants';
import {
  getItem,
  getLoaderDisplayTime,
  navigate,
  removeItem,
  setItem,
} from '../helpers';
import { useTimeoutAction } from '../hooks';

const initialValue = {
  userName: '',
  signedIn: false,
  loading: false,
  setLoading: () => undefined,
  signIn: () => undefined,
  signOut: () => undefined,
};

export const UserContext = createContext(initialValue);

const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(() => getItem(storageKeys.userName));

  const resetLoadingState = useCallback(() => setLoading(false), []);
  //spoofed delay to show my cute loader :)
  const loaderTime = getLoaderDisplayTime();
  const resetLoadingStateAfterDelay = useTimeoutAction(
    resetLoadingState,
    loaderTime
  );

  useEffect(() => {
    if (!userName) {
      const storedUser = getItem(storageKeys.userName);
      !!storedUser && setUserName(storedUser);
    }
    resetLoadingStateAfterDelay();
  }, [resetLoadingStateAfterDelay, userName]);

  const signIn = useCallback(
    (newUserName) => {
      setLoading(true);
      setUserName(newUserName);
      setItem(storageKeys.userName, newUserName);
      navigate(frontendRoutes.home);
      resetLoadingStateAfterDelay();
    },
    [resetLoadingStateAfterDelay]
  );

  const signOut = useCallback(() => {
    setUserName('');
    removeItem(storageKeys.userName);
    navigate(frontendRoutes.signIn);
    resetLoadingStateAfterDelay();
  }, [resetLoadingStateAfterDelay]);

  return (
    <UserContext.Provider
      value={{
        userName,
        signedIn: !!userName,
        loading,
        setLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
