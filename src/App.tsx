import React from 'react';
import Root from 'router';
import {ConfigProvider} from 'antd';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import frIR from 'antd/lib/locale/fa_IR';
import enUS from 'antd/lib/locale/en_US';
import {isEnLocale} from 'utils';
import {UsersProvider} from 'contexts/UsersContext';
import {ErrorBoundaryHandler} from 'components';
import withClearCache from 'ClearCache';
import 'libs/I18n';

const ClearCacheComponent = withClearCache(MainApp);

function App() {
  return <ClearCacheComponent />;
}

function MainApp() {
  const isEn = isEnLocale();
  const queryClient = new QueryClient();

  return (
    <ErrorBoundaryHandler>
      <ConfigProvider
        direction={isEn ? 'ltr' : 'rtl'}
        locale={isEn ? enUS : frIR}
        theme={{token: {fontFamily: 'var(--font-family)'}}}>
        <UsersProvider>
          <QueryClientProvider client={queryClient}>
            <Root />
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
            )}
          </QueryClientProvider>
        </UsersProvider>
      </ConfigProvider>
    </ErrorBoundaryHandler>
  );
}
export default App;
