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
  required?: boolean;
}

const TriggerSignIn: React.FC<TriggerSignInProps> = ({
  children,
  components,
  signInProps,
  required,
}) => {
  const { is_authenticated, is_initializing, requestSignIn } = useRownd();

  useEffect(() => {
    if (!is_authenticated && !is_initializing) {
      const newSignInProps = signInProps || {};
      if (typeof required === 'boolean') {
        newSignInProps.prevent_closing = required;
      }
      requestSignIn(newSignInProps);
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
