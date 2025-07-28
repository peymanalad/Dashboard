import axios, {AxiosResponse, AxiosError} from 'axios';
import {ResponseErrorHandler} from 'utils';
import {ResponseProps} from 'types/request';
import {notification} from 'antd';
import {i18n} from 'libs';
import {windowProcess} from 'utils/process';

const instance = axios.create({
  baseURL: `${windowProcess('REACT_APP_BASE_URL')}/api`,
  timeout: 60000
});
instance.interceptors.response.use(
  (response: AxiosResponse): ResponseProps => {
    if (response.config.method !== 'get' && !response?.config?.headers?.silent) {
      notification.success({
        duration: 2,
        message: response?.data?.message || i18n.t('general:messages:success')
      });
    }

    return {
      data: response.data?.result || response.data,
      error: response.data?.error,
      success: response.data?.success
    };
  },
  (error: AxiosError) => ResponseErrorHandler(error)
);
export default instance;
