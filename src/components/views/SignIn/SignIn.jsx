import { useCallback, useEffect, useState } from 'react';
import { frontendRoutes } from '../../../constants';
import {
  navigate,
  normalizeName,
  validateStringLength,
} from '../../../helpers';
import { useTextInputState, useTimeoutAction, useUser } from '../../../hooks';
import slowBlink from '../../../assets/slow_blink.gif';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import './SignIn.css';

const SignIn = () => {
  const { signedIn, signIn } = useUser();

  const [loading, setLoading] = useState(false);
  const name = useTextInputState({
    required: true,
    normalizer: normalizeName,
    validation: validateStringLength(50),
  });

  useEffect(() => {
    if (signedIn) navigate(frontendRoutes.home);
  }, [signedIn]);

  const resetLoaderAfterSignIn = useCallback(
    (userName) => {
      signIn(userName);
      setLoading(false);
    },
    [signIn]
  );
  const signInAfterDelay = useTimeoutAction(resetLoaderAfterSignIn, 1000); //demo of button loading state

  const handleSignIn = useCallback(
    (e) => {
      e?.preventDefault();
      if (name.valid) {
        setLoading(true);
        signInAfterDelay(name.value);
      } else name.forceError();
    },
    [name, signInAfterDelay]
  );

  return (
    <div className='centered-page sign-in'>
      <form onSubmit={handleSignIn}>
        <img src={slowBlink} alt='blinking eye' />
        <h1>Welcome</h1>
        <Input
          fullWidth
          name='name'
          label='Name'
          placeholder='Enter your name (case sensitive)'
          fieldHandler={name}
        />
        <Button fullWidth loading={loading} type='submit'>
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
