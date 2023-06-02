import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {useQuery} from 'react-query';
import useUser from 'hooks/user/useUser';
import {urlGenerator, allocateParamToString} from 'utils';
import merge from 'lodash/merge';
import get from 'lodash/get';
import isString from 'lodash/isString';
import {useAxios, useError} from 'hooks';
import compact from 'lodash/compact';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';

interface IGetConfig {
  name?: Array<string | number | undefined | null> | string;
  url: string;
  version?: number;
  page: number;
  staleTime?: number;
  cacheTime?: number;
  query?: object;
  search?: object;
  params?: object;
  isGeneral?: boolean;
  enabled?: boolean;
  onSuccess?(data: AxiosResponse): void;
  onError?(error: AxiosError): void;
}
const usePagination = ({
  name = 'notLongTimeAvailable',
  url,
  page = 1,
  version,
  query,
  search,
  params,
  onSuccess,
  onError,
  enabled = false,
  isGeneral = false,
  staleTime = 180000,
  cacheTime = 600000
}: IGetConfig) => {
  let prettyName = isString(name) ? name : compact(name);

  if (prettyName === 'notLongTimeAvailable' || !isEmpty(search)) {
    prettyName = [];
    staleTime = 0;
    cacheTime = 0;
  }

  const user = useUser();
  const AxiosInstance = useAxios();
  const errorHandler = useError();

  const requestConfig: AxiosRequestConfig = {
    url: allocateParamToString(urlGenerator(url, version, isGeneral), params),
    method: 'GET',
    params: merge(merge({page}, query), search),
    headers: {Authorization: user?.access_token ? `Bearer ${user?.access_token}` : ''}
  };

  const paginateQuery = useQuery(concat(prettyName, page), () => AxiosInstance(requestConfig), {
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
    keepPreviousData: false,
    enabled,
    staleTime,
    cacheTime,
    retryDelay: 5000,
    onSuccess,
    onError,
    retry: errorHandler.handle
  });
  const refresh = () => paginateQuery.remove();
  const data = get(paginateQuery, ['data', 'data']);
  const meta = get(paginateQuery, ['data', 'meta']);

  return {...paginateQuery, refresh, data, meta};
};

export default usePagination;
