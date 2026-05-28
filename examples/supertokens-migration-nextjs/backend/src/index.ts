import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import Passwordless from 'supertokens-node/recipe/passwordless';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import AccountLinking from 'supertokens-node/recipe/accountlinking';
import { middleware, errorHandler } from 'supertokens-node/framework/express';
import RowndPlugin from '@supertokens-plugins/rownd-nodejs';

const PORT = Number(process.env.PORT) || 3001;
const WEBSITE_ORIGIN = process.env.WEBSITE_ORIGIN || 'http://localhost:3000';
const HUB_ORIGIN = process.env.HUB_ORIGIN || 'http://localhost:8787';
const ALLOWED_ORIGINS = [WEBSITE_ORIGIN, HUB_ORIGIN];

supertokens.init({
  framework: 'express',
  supertokens: {
    connectionURI:
      process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567',
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: 'Next.js User Migration Example',
    apiDomain: `http://localhost:${PORT}`,
    websiteDomain: WEBSITE_ORIGIN,
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [
    Passwordless.init({
      contactMethod: 'EMAIL_OR_PHONE',
      flowType: 'USER_INPUT_CODE',
    }),
    Session.init({
      getTokenTransferMethod: () => 'header',
    }),
    UserMetadata.init(),
    AccountLinking.init({
      shouldDoAutomaticAccountLinking: async () => ({
        shouldAutomaticallyLink: true,
        shouldRequireVerification: false,
      }),
    }),
  ],
  experimental: {
    plugins: [
      RowndPlugin.init({
        rowndAppKey: process.env.ROWND_APP_KEY!,
        rowndAppSecret: process.env.ROWND_APP_SECRET!,
        enableDebugLogs: true,
      }),
    ],
  },
});

const app = express();

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, _res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} (origin: ${req.headers.origin ?? 'none'})`
  );
  next();
});

app.use(middleware());
app.use(errorHandler());

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(
    `SuperTokens Core: ${process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567'}`
  );
});
