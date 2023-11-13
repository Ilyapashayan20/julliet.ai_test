// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (process.env.NODE_ENV === 'production' && SENTRY_DSN) {
  Sentry.init({
    dsn:
      SENTRY_DSN ||
      'https://e83ea70d24fc4209bef51552f1cb2027@o4504067717201920.ingest.sentry.io/4504357841928192',
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new Sentry.Replay()]
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
}
