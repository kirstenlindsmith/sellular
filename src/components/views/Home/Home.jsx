import { useEffect } from 'react';
import { frontendRoutes } from '../../../constants';
import { navigate } from '../../../helpers';
import { useUser } from '../../../hooks';
import Link from '../../Link';

const Home = () => {
  const { signedIn } = useUser();

  useEffect(() => {
    if (!signedIn) navigate(frontendRoutes.signIn);
  }, [signedIn]);

  return (
    <>
      <div>Home</div>
      <Link href={frontendRoutes.signOut}>Sign out</Link>
    </>
  );
};

export default Home;
