import axios, {AxiosResponse, AxiosError} from 'axios';
import {ResponseErrorHandler} from 'utils';
import {responseProps} from 'types/request';
import {notification} from 'antd';
import {i18n} from 'libs';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 30000
});
instance.interceptors.response.use(
  (response: AxiosResponse): responseProps => {
    if (response.config.method !== 'get' && !response?.config?.headers?.silent)
      notification.success({
        duration: 2,
        message: response?.data?.message || i18n.t('general:messages:success')
      });

    return {
      data: response.data?.data,
      meta: response.data?.meta,
      schema: response.data?.schema,
      status: response.status,
      statusText: response.statusText
    };
  },
  (error: AxiosError) => ResponseErrorHandler(error)
);
export default instance;
