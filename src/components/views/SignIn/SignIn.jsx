import { useCallback, useEffect } from 'react';
import { frontendRoutes } from '../../../constants';
import { navigate, validateStringLength } from '../../../helpers';
import { useTextInputState, useUser } from '../../../hooks';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import sharedStyles from '../../../style/shared.styles';
import './SignIn.css';

const SignIn = () => {
  const { signedIn, signIn } = useUser();
  const name = useTextInputState({
    required: true,
    validation: validateStringLength(50, 1),
  });

  useEffect(() => {
    if (signedIn) navigate(frontendRoutes.home);
  }, [signedIn]);

  const handleSignIn = useCallback(
    (e) => {
      e?.preventDefault();
      if (name.valid) signIn(name.value);
      else name.forceError();
    },
    [name, signIn]
  );

  return (
    <div className='centered-page sign-in' style={sharedStyles.lightBluePage}>
      <form onSubmit={handleSignIn}>
        <h1>Welcome</h1>
        <Input
          name='name'
          label='Name'
          placeholder='Enter your name (case sensitive)'
          fieldHandler={name}
        />
        <Button fullWidth type='submit'>
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
