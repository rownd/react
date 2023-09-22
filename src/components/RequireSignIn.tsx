import React, { useEffect } from 'react';
import { useRownd } from '../context';
import { SignInProps } from '../context/types';

interface RequireSignInProps {
  children?: React.ReactNode;
  initializing?: React.ReactNode;
  signInProps?: SignInProps;
}

const RequireSignIn: React.FC<RequireSignInProps> = ({
  children,
  initializing,
  signInProps,
}) => {
  const { is_authenticated, is_initializing, requestSignIn } = useRownd();

  useEffect(() => {
    if (!is_authenticated && !is_initializing) {
      requestSignIn({ prevent_closing: true, ...signInProps });
    }
  }, [is_authenticated, is_initializing, requestSignIn, signInProps]);

  if (is_initializing && initializing) {
    return <>{initializing}</>;
  }

  return <>{children}</>;
};

export default RequireSignIn;
