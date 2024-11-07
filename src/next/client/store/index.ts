import { TRowndContext, UserContext } from "../../../context/types";
import { createStore } from "./store";

export const store = createStore<TRowndContext>(
  {
    requestSignIn: () => {},
    getAccessToken: () => Promise.resolve(''),
    signOut: () => {},
    manageAccount: () => {},
    passkeys: {
      register: () => {},
      authenticate: () => {},
    },
    setUser: () => Promise.resolve({} as UserContext),
    setUserValue: () => Promise.resolve({} as UserContext),
    getFirebaseIdToken: () => Promise.resolve(''),
    getAppConfig: () => {},
    is_initializing: true,
    is_authenticated: false,
    access_token: null,
    auth: {
      access_token: null,
      is_authenticated: false,
    },
    events: {
      addEventListener: () => {},
      removeEventListener: () => {},
    },
    user: {
      data: {},
      groups: [],
      redacted_fields: [],
      verified_data: {},
      meta: {},
      instant_user: {
        is_initializing: false,
      },
      is_loading: false,
    },
  }
);