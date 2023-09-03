import replace from 'lodash/replace';
import {AxiosError} from 'axios';
import i18n from 'libs/I18n';
import {notification} from 'antd';
import {onlineManager} from 'react-query';
import {hashToArray, isURL} from 'utils';
import get from 'lodash/get';
import values from 'lodash/values';
import isEmpty from 'lodash/isEmpty';
import toNumber from 'lodash/toNumber';

export const urlGenerator = (url: string): string => (isURL(url) ? url : replace(`/${url}`, '//', '/'));

export const getLangSearchParam = (url: string): string => {
  const lang = new URL(window.location.href).searchParams.get('lang');
  if (!lang || lang?.toString().length !== 2) return url;
  return `${url}?lang=${lang}`;
};

export const getHashTab = (hashRoute: string, tabKey: string): number | 'new' | undefined => {
  const hash: string[] = hashToArray(hashRoute);
  return get(hash, 0) === tabKey ? (get(hash, 1) === 'new' ? 'new' : toNumber(get(hash, 1))) : undefined;
};

export const ResponseErrorHandler = (error: AxiosError): Promise<AxiosError> => {
  const response: any = error?.response?.data;
  const status: number | undefined = error?.response?.status;
  let message: string = '';
  if (status === 422) message = values(response?.data).join('\n');
  else if (status === 404 || status === 419 || status === 429 || status === 403 || status === 401)
    message = i18n.t(`error:${response?.error?.message?.replaceAll(' ', '_')}`);
  else if (error.code === 'ECONNABORTED') message = i18n.t('error:serverBusy');
  else if (!onlineManager.isOnline()) message = i18n.t('error:connection');
  else if (status === 500) message = response?.message || response?.error?.message || i18n.t('error:500');
  if (!isEmpty(message) && !error?.config?.headers?.silent) {
    notification.error({
      duration: 2,
      message
    });
  }
  return Promise.reject(error);
};
