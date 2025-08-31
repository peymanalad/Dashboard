import React from 'react';
import {createRoot} from 'react-dom/client';
import App from 'App';
import {ServiceWorker} from 'libs';
import 'App.css';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://2df0b1af7645b2a74c7bc2907ae6829b@sentry.stinascloud.ir/7',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
    <ServiceWorker />
  </React.StrictMode>
);
