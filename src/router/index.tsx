import React, {Suspense} from 'react';
import {BrowserRouter as RouterBrowser, Switch as RouterSwitch, Route as RouterRoute} from 'react-router-dom';
import {FullScreenLoading} from 'components';
import {useUser} from 'hooks';
import {lazyWithRetry} from 'utils';

const Login = lazyWithRetry(() => import('pages/authentication/Login'));
const Landing = lazyWithRetry(() => import('pages/Landing'));
const DashboardRoutes = lazyWithRetry(() => import('pages/dashboard/index'));
const NotFoundPage = lazyWithRetry(() => import('pages/error/404'));

const BrowserRouter: any = RouterBrowser;
const Switch: any = RouterSwitch;
const Route: any = RouterRoute;


function Root() {
  const user = useUser();

  return (
    <BrowserRouter>
      <Suspense fallback={<FullScreenLoading />}>
        {user.is_logged_in ? (
          <Route path="/" component={DashboardRoutes} />
        ) : (
          <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/" component={Landing} exact />
            <Route component={NotFoundPage} />
          </Switch>
        )}
      </Suspense>
    </BrowserRouter>
  );
}

export default Root;
