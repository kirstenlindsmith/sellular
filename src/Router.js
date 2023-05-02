import { useCallback, useMemo } from 'react';
import { frontendRoutes } from './constants';
import { useItems, usePath, useUser } from './hooks';
import Items from './components/views/Items';
import ItemDetail from './components/views/ItemDetail';
import NotFound from './components/views/NotFound';
import PageLoader from './components/PageLoader';
import SignIn from './components/views/SignIn';
import SignOut from './components/views/SignOut';

const routes = [
  {
    path: frontendRoutes.home,
    component: <Items />,
    exact: true,
    title: 'Sellular | All products',
  },
  {
    path: frontendRoutes.item,
    component: <ItemDetail />,
    title: 'Sellular | Product detail',
    description: 'Product listing details',
  },
  {
    path: frontendRoutes.userItems,
    component: <Items />,
    title: 'Sellular | User products',
    description: 'All products listed by this user',
  },
  {
    path: frontendRoutes.signIn,
    component: <SignIn />,
    exact: true,
    title: 'Sellular | Sign in',
  },
  {
    path: frontendRoutes.signOut,
    component: <SignOut />,
    exact: true,
    title: 'Sellular | Sign out',
  },
];

const Router = () => {
  const path = usePath();
  const { loading: loadingUser } = useUser();
  const { loading: loadingItems } = useItems();

  const route = useMemo(
    () =>
      routes.find((route) =>
        route.exact ? route.path === path : path.includes(route.path)
      ),
    [path]
  );
  const Component = useCallback(
    () => route?.component ?? <NotFound />,
    [route]
  );

  if (loadingUser || loadingItems) return <PageLoader />;

  return (
    <>
      <meta
        name='description'
        content={route.description || 'View products & list products'}
      />
      <title>{route.title || 'Sellular'}</title>
      <Component />
    </>
  );
};

export default Router;
