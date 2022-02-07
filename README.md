# React bindings for Rownd

## Installation

Simply run `npm install @rownd/react` or `yarn add @rownd/react`.

## Usage

The library providers a React provider and hook for the Rownd browser API.

In your app's main entrypoint, add the Rownd provider, likely before other providers:
```js
import React from 'react',
import ReactDOM from 'react-dom';
import { RowndProvider } from '@rownd/react';

ReactDOM.render(
  <RowndProvider>
    <App />
  </RowndProvider>,
  document.getElementById('root')
);

```

Later on within your app's components, you can use the Rownd hook to access the Rownd browser API:

```js
import React from 'react';
import { useRownd } from '@rownd/react';

export default function MyProtectedComponent(props) {
  const { is_authenticated, user, requestSignIn } = useRownd();

  useEffect(() => {
    if (!is_authenticated) {
      requestSignIn();
    }
  }, [is_authenticated]);

  return (
    <div>
      {is_authenticated ? (
        <div>
          <h1>Welcome {user.data.full_name}</h1>
          <button onClick={() => getAccessToken()}>Get access token</button>
        </div>
      ) : (
        <div>
          <h1>Please sign in to continue</h1>
        </div>
      )}
    </div>
  );
}
```

## API reference

Coming soon...
