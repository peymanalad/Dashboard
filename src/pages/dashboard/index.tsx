/* eslint-disable react/jsx-curly-brace-presence */
import React, {Suspense, lazy, FC, useRef, ElementRef, useMemo, useEffect} from 'react';
import {useUser, useFetch, useLogOut} from 'hooks';
import {Redirect as RouterRedirect, Switch as RouterSwitch, Route as RouterRoute, useLocation} from 'react-router-dom';
import {Layout, Row, Spin, Typography} from 'antd';
import {TopHeader, SideMenu} from 'containers';
import {Scrollbars} from 'react-custom-scrollbars';
import {getFilteredMenusList} from 'router/dashboard';
import {FullScreenLoading} from 'components';
import {useTranslation} from 'react-i18next';
import {windowProcess} from 'utils/process';
import flatMap from 'lodash/flatMap';
import includes from 'lodash/includes';
import {UserTypeEnum} from 'types/user';

const ScrollbarsAny = Scrollbars as any;

// react-router-dom's Switch is typed for React 17; cast to any for React 18 compatibility.
const Switch: any = RouterSwitch;
const Route: any = RouterRoute;
const Redirect: any = RouterRedirect;

const NotFoundPage = lazy(() => import('pages/dashboard/NotFoundPage'));

const {Content, Footer} = Layout;
const {Text} = Typography;

const Dashboard: FC = () => {
  const {t} = useTranslation('dashboard');
  const sideMenuRef = useRef<ElementRef<typeof SideMenu>>(null);
  const location = useLocation();
  const user = useUser();
  const userType = user.getUserType();
  const logOut = useLogOut();

  const isDashboard = includes(location.pathname, 'dashboard');
  const isChatSection = useMemo(
    () =>
      includes(location.pathname, 'comment/doctor/edit') ||
      includes(location.pathname, 'comment/patient/edit') ||
      includes(location.pathname, 'education/recommendation/edit/comment') ||
      includes(location.pathname, 'message/support/chat') ||
      includes(location.pathname, 'message/friend/') ||
      includes(location.pathname, 'message/ticket'),
    [location]
  );

  const fetchMenu = useFetch({
    url: 'services/app/Session/GetCurrentLoginInformations',
    name: 'profile',
    cacheTime: Infinity,
    staleTime: Infinity,
    enabled: true
  });

  // only for check validation access token
  useFetch({
    name: ['profile', 'OrganizationCharts'],
    url: '/services/app/DeedCharts/GetAll',
    query: {
      SkipCount: 0,
      MaxResultCount: 500
    },
    enabled: true
  });

  useEffect(() => {
    if (user?.id && userType === UserTypeEnum.Normal) {
      logOut.logOut();
    }
  }, [user?.id]);

  return (
    <Layout className={`w-screen h-screen ${isDashboard ? 'bg-grayDark' : ''}`}>
      <SideMenu ref={sideMenuRef} />
      <ScrollbarsAny id="MainContent" style={{width: '0'}}>
        <Layout className={`${isChatSection ? 'h-full md:h-unset' : ''}`}>
          <TopHeader
            allowFetchDashboard={fetchMenu.isSuccess}
            onMenuClick={() => {
              if (sideMenuRef.current) sideMenuRef.current.collapseMenu();
            }}
          />
          <Content
            className={`mt-4 w-full h-full m-0 min-h-75vh px-0 ${!isDashboard ? 'md:px-6' : ''}  ${
              !isChatSection ? (isDashboard ? 'py-6' : 'py-6') : 'py-0 md:py-6'
            }`}>
            <Suspense fallback={<FullScreenLoading />}>
              {fetchMenu?.isFetching && (
                <Row justify="center" align="middle" className="min-h-75vh">
                  <Spin tip={t('fetching_menu')} />
                </Row>
              )}
              <Switch>
                {fetchMenu?.data &&
                  flatMap(getFilteredMenusList(user?.getUserType(), user?.isSuperUser()), (item: any) => {
                    if (item?.cmp && item?.route && item?.subs) {
                      return [{route: item?.route, title: item.title, cmp: item.cmp}, ...item?.subs];
                    }
                    if (item?.cmp && item?.route && !item?.subs) {
                      return [{route: item?.route, title: item.title, cmp: item.cmp}];
                    }
                    return item.subs;
                  })?.map((subItem, index) =>
                    !Array.isArray(subItem) && subItem?.cmp ? (
                      <Route key={index.toString()} component={() => subItem?.cmp} path={subItem?.route} exact />
                    ) : (
                      subItem.subs &&
                      subItem?.subs?.map((Item: any, indexItem: any) => (
                        <Route key={`${index}.${indexItem}`} component={() => Item?.cmp} path={Item?.route} exact />
                      ))
                    )
                  )}
                {fetchMenu?.data && <Redirect from="/" to="/dashboard" exact />}
                {fetchMenu?.data && <Route component={NotFoundPage} />}
              </Switch>
            </Suspense>
          </Content>
          {!isDashboard && (
            <Footer
              className={`w-full flex-col sm:flex-row justify-around items-center p-8 ${
                isChatSection ? 'd-none md:d-flex' : 'd-flex'
              }`}>
              <Text className="text-gray">
                {t('footer.message', {version: windowProcess('REACT_APP_APP_VERSION')})}
              </Text>
            </Footer>
          )}
        </Layout>
      </ScrollbarsAny>
    </Layout>
  );
};

export default Dashboard;
