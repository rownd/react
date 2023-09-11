export type TRowndContext = {
  requestSignIn: (e?: SignInProps) => void;
  signOut: Function;
  getAccessToken: Function;
  is_authenticated: boolean;
  is_initializing: boolean;
  access_token: string | null;
  auth: AuthContext;
  user: UserContext;
};

export type SignInProps = {
  identifier?: string;
  auto_sign_in?: boolean;
  post_login_redirect?: string;
  prevent_closing?: boolean;
} & (
  | {
      method?: string;
    }
  | {
      method: 'one_tap';
      method_options?: {
        prompt_parent_id?: string;
      };
    }
  | {
      method: 'email' | 'phone' | 'google' | 'apple' | 'passkeys' | 'anonymous';
    }
)

type AuthContext = {
  access_token: string | null;
  app_id?: string;
  is_authenticated: boolean;
  is_verified_user?: boolean;
};

type UserContext = {
  data: {
    id?: string;
    email?: string | null;
    phone?: string | null;
    [key: string]: any;
  };
  redacted_fields: string[];
};
