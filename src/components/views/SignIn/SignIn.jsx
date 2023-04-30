import { useCallback, useEffect } from 'react';
import { frontendRoutes } from '../../../constants';
import { navigate, validateStringLength } from '../../../helpers';
import { useTextInputState, useUser } from '../../../hooks';
import Input from '../../Input';
import styles from './SignIn.styles';
import Button from '../../Button';

const SignIn = () => {
  const { signedIn, signIn } = useUser();
  const name = useTextInputState({
    required: true,
    validation: validateStringLength(50, 1),
  });

  useEffect(() => {
    if (signedIn) navigate(frontendRoutes.home);
  }, [signedIn]);

  const handleSignIn = useCallback(() => {
    if (name.valid) signIn(name.value);
    else name.forceError();
  }, [name, signIn]);

  return (
    <div className='centered-page' style={styles.root}>
      <div style={styles.content}>
        <h1 style={styles.header}>What's your name?</h1>
        <Input
          name='name'
          label='Name'
          placeholder='Enter your name'
          fieldHandler={name}
        />
        <Button fullWidth onClick={handleSignIn}>
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
