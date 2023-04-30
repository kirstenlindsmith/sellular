import { useEffect, useState } from 'react';
import { frontendRoutes } from './constants';
import { useItems, useUser } from './hooks';
import AllItems from './components/views/AllItems';
import NotFound from './components/views/NotFound';
import PageLoader from './components/PageLoader';
import SignIn from './components/views/SignIn';
import SignOut from './components/views/SignOut';

const routes = [
  { path: frontendRoutes.home, component: <AllItems /> },
  { path: frontendRoutes.signIn, component: <SignIn /> },
  { path: frontendRoutes.signOut, component: <SignOut /> },
];

const Router = () => {
  const { loading: loadingUser } = useUser();
  const { loading: loadingItems } = useItems();

  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname
  );

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    onLocationChange();
    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  if (loadingUser || loadingItems) return <PageLoader />;

  return (
    routes.find((route) => route.path === currentPath)?.component ?? (
      <NotFound />
    )
  );
};

export default Router;
