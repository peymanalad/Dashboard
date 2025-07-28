import React, {FC} from 'react';
import {FallBackError} from 'components';
import * as Sentry from '@sentry/react';
// import {BrowserTracing} from '@sentry/tracing';

// Sentry.init({
//   dsn: 'https://f4281d7a02c541e68828f202af96d088@sentry.mobinn.ir/1',
//   integrations: [new BrowserTracing()],
//   enabled: process.env.NODE_ENV === 'production',
//   debug: process.env.NODE_ENV === 'development'
// });

const ErrorBoundaryHandler: FC = ({children}) => {
  // @ts-ignore
  return <Sentry.ErrorBoundary fallback={FallBackError}>{children}</Sentry.ErrorBoundary>;
};

export default ErrorBoundaryHandler;
