import React, { useEffect } from 'react';
import { useRownd } from '../context';
import { SignInProps } from '../context/types';

interface TriggerSignInProps {
  children: React.ReactNode;
  components: {
    Initializing?: React.ReactNode;
    Unauthenticated?: React.ReactNode;
  };
  signInProps?: SignInProps;
}

const TriggerSignIn: React.FC<TriggerSignInProps> = ({
  children,
  components,
  signInProps,
}) => {
  const { is_authenticated, is_initializing, requestSignIn } = useRownd();

  useEffect(() => {
    if (!is_authenticated && !is_initializing) {
      requestSignIn(signInProps || {});
    }
  }, [is_authenticated, is_initializing, requestSignIn]);

  if (is_initializing && components.Initializing) {
    return <>{components.Initializing}</>;
  }

  if (!is_authenticated && components.Unauthenticated) {
    return <>{components.Unauthenticated}</>;
  }

  return <>{children}</>;
};

export default TriggerSignIn;
