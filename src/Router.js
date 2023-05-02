import { frontendRoutes } from './constants';
import { useItems, usePath, useUser } from './hooks';
import AllItems from './components/views/AllItems';
import NotFound from './components/views/NotFound';
import PageLoader from './components/PageLoader';
import SignIn from './components/views/SignIn';
import SignOut from './components/views/SignOut';
import ItemDetail from './components/views/ItemDetail';

const routes = [
  { path: frontendRoutes.home, component: <AllItems />, exact: true },
  { path: frontendRoutes.item, component: <ItemDetail /> },
  { path: frontendRoutes.signIn, component: <SignIn />, exact: true },
  { path: frontendRoutes.signOut, component: <SignOut />, exact: true },
];

const Router = () => {
  const path = usePath();
  const { loading: loadingUser } = useUser();
  const { loading: loadingItems } = useItems();

  if (loadingUser || loadingItems) return <PageLoader />;

  return (
    routes.find((route) =>
      route.exact ? route.path === path : path.includes(route.path)
    )?.component ?? <NotFound />
  );
};

export default Router;
