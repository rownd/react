# Next.js SuperTokens Migration Example

This example verifies Rownd-to-SuperTokens lazy migration through `@rownd/next`.

It has two apps:

- `backend`: Express + SuperTokens + `@supertokens-plugins/rownd-nodejs`
- `frontend`: Next.js App Router + `@rownd/next`

## Run

Build the local SDK packages from the repo root first:

```bash
npm run build
```

Start SuperTokens Core locally, then run the backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Run the Next.js frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`, sign up as a new Rownd user, and verify that the backend receives `POST /auth/plugin/rownd/migrate`.
