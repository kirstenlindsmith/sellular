import { frontendRoutes } from '../../../constants';
import Link from '../../Link';

const SignOut = () => {
  return (
    <>
      <div>SignOut</div>
      <Link href={frontendRoutes.signIn}>SignIn</Link>
    </>
  );
};

export default SignOut;
