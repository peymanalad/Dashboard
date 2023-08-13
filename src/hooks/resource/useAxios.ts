import {useHistory} from 'react-router-dom';
import usePersist from 'hooks/storage/usePersist';
import {useTranslation} from 'react-i18next';
import {AxiosInstance} from 'libs';
import axios, {AxiosRequestConfig} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {useUser} from 'hooks';
import {notification} from 'antd';
import qs from 'qs';
import {getLangSearchParam, urlGenerator} from 'utils';
import get from 'lodash/get';
import type {userAccessProps} from 'types/user';

const useAxios = () => {
  const {t} = useTranslation('general');
  const user = useUser();
  const persist = usePersist();
  const history = useHistory();

  const refreshAuthLogic = (failedRequest: any) => {
    const token: userAccessProps = persist.getData('token');

    const requestConfig: AxiosRequestConfig = {
      baseURL: `${process.env.REACT_APP_BASE_URL}/api`,
      timeout: 15000,
      url: urlGenerator('TokenAuth/RefreshToken'),
      method: 'POST',
      headers: {silent: true},
      params: {refreshToken: token?.refresh_token}
    };

    if (!token?.is_logged_in) return Promise.resolve();

    return axios(requestConfig)
      .then((tokenRefreshResponse) => {
        const newUsers: userAccessProps = {...token, access_token: tokenRefreshResponse?.data?.result?.accessToken};
        user.setUser(newUsers);
        failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse?.data?.result?.accessToken}`;
        return Promise.resolve();
      })
      .catch(() => {
        user.setUser({is_logged_in: false});
        history.replace({
          pathname: getLangSearchParam('/'),
          search: qs.stringify({redirect: history.location?.pathname})
        });
        // if request is post or patch (not get) show notification to user resend request
        if (failedRequest.response.config?.method !== 'get')
          notification.warning({
            duration: 2,
            message: t('messages.tryAgain')
          });
      });
  };

  createAuthRefreshInterceptor(AxiosInstance, refreshAuthLogic, {statusCodes: [401]});

  return AxiosInstance;
};

export default useAxios;
