import {getLangSearchParam, urlGenerator} from 'utils';
import {AxiosInstance} from 'libs';
import axios, {AxiosRequestConfig} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {useUser} from 'hooks';
import merge from 'lodash/merge';
import {notification} from 'antd';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import qs from 'qs';
import {userAccessProps} from 'types/user';
import {get, set} from 'lodash';
import usePersist from 'hooks/storage/usePersist';

const useAxios = () => {
  const {t} = useTranslation('general');
  const user = useUser();
  const persist = usePersist();
  const history = useHistory();

  const refreshAuthLogic = (failedRequest: any) => {
    const token = persist.getData('token');

    const requestConfig: AxiosRequestConfig = {
      baseURL: process.env.REACT_APP_BASE_URL,
      timeout: 15000,
      url: urlGenerator('auth/refresh', undefined, true),
      method: 'POST',
      headers: {Authorization: `Bearer ${get(token, [0, 'access_token'])}`, silent: true},
      data: {refresh_token: get(token, [0, 'refresh_token'])}
    };

    return axios(requestConfig)
      .then((tokenRefreshResponse) => {
        const newUsers: userAccessProps[] = [...token];
        set(newUsers, 0, merge({...get(newUsers, 0), is_logged_in: true}, tokenRefreshResponse?.data?.data));
        user.setUsers(newUsers);
        failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data?.data?.access_token}`;
        return Promise.resolve();
      })
      .catch(() => {
        const currentUsers = [...token];
        currentUsers.shift();
        user.setUsers(currentUsers);
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
