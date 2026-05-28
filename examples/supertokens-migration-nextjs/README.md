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

Set `ROWND_APP_KEY` and `ROWND_APP_SECRET` in `backend/.env` before starting the backend.

Run the Next.js frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_ROWND_APP_KEY` in `frontend/.env.local` to the same Rownd app key used by the backend.

Open `http://localhost:3000`, sign up as a new Rownd user, and verify that the backend receives `POST /auth/plugin/rownd/migrate`.
