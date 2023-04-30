import { useEffect, useState } from 'react';
import { frontendRoutes } from './constants';
import { useUser } from './hooks';
import Home from './components/views/Home/Home';
import NotFound from './components/views/NotFound';
import PageLoader from './components/PageLoader';
import SignIn from './components/views/SignIn/SignIn';
import SignOut from './components/views/SignOut/SignOut';

const routes = [
  { path: frontendRoutes.home, component: <Home /> },
  { path: frontendRoutes.signIn, component: <SignIn /> },
  { path: frontendRoutes.signOut, component: <SignOut /> },
];

const Router = () => {
  const { loading } = useUser();

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

  if (loading) return <PageLoader />;

  return (
    routes.find((route) => route.path === currentPath)?.component ?? (
      <NotFound />
    )
  );
};

export default Router;
