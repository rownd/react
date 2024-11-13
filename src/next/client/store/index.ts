import { TRowndContext } from "../../../context/types";
import { createStore } from "./store";

const notInitialized = () => {
  console.log('Rownd context/provider not initialized yet.');
  return Promise.resolve(null as any);
};

export const store = createStore<TRowndContext>(
  {
    requestSignIn: () => {},
    getAccessToken: () => notInitialized(),
    signOut: () => {},
    manageAccount: () => {},
    passkeys: {
      register: () => {},
      authenticate: () => {},
    },
    setUser: () => notInitialized(),
    setUserValue: () => notInitialized(),
    getFirebaseIdToken: () => notInitialized(),
    getAppConfig: () => notInitialized(),
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