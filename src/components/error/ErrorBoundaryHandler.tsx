import React, {FC} from 'react';
import {FallBackError} from 'components';
import * as Sentry from '@sentry/react';
import {BrowserTracing} from '@sentry/tracing';

Sentry.init({
  dsn: 'https://f4281d7a02c541e68828f202af96d088@sentry.behzee.com/11',
  integrations: [new BrowserTracing()],
  release: process.env.REACT_APP_APP_VERSION,
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development'
});

const ErrorBoundaryHandler: FC = ({children}) => {
  // @ts-ignore
  return <Sentry.ErrorBoundary fallback={FallBackError}>{children}</Sentry.ErrorBoundary>;
};

export default ErrorBoundaryHandler;
