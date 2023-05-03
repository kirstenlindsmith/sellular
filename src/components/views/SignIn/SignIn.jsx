import { useCallback, useEffect } from 'react';
import { frontendRoutes } from '../../../constants';
import {
  navigate,
  normalizeName,
  validateStringLength,
} from '../../../helpers';
import { useTextInputState, useUser } from '../../../hooks';
import slowBlink from '../../../assets/slow_blink.gif';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import './SignIn.css';

const SignIn = () => {
  const { signedIn, signIn } = useUser();
  const name = useTextInputState({
    required: true,
    normalizer: normalizeName,
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
    <div className='centered-page sign-in'>
      <form onSubmit={handleSignIn}>
        <img src={slowBlink} alt='blinking eye' style={{ width: '20rem' }} />
        <h1>Welcome</h1>
        <Input
          fullWidth
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
