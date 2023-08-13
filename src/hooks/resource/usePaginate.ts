import {useState, useEffect} from 'react';
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
import type {dynamicParams} from 'types/common';
import values from 'lodash/values';
import without from 'lodash/without';

interface IGetConfig {
  name?: Array<string | number | undefined | null> | string;
  url: string;
  version?: number;
  page: number;
  perPage?: number;
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
  perPage,
  query,
  search,
  params,
  onSuccess,
  onError,
  enabled = false,
  staleTime = 180000,
  cacheTime = 600000
}: IGetConfig) => {
  const [dynamicParams, setDynamicParams] = useState<dynamicParams | undefined>(undefined);
  let prettyName: Array<string | number | undefined | null> | string = isString(name) ? name : compact(name);

  if (
    prettyName === 'notLongTimeAvailable' ||
    !isEmpty(without(values(merge(search, dynamicParams?.search)), undefined, null))
  ) {
    prettyName = concat(name, ['search']);
    staleTime = 0;
    cacheTime = 0;
  }

  const user = useUser();
  const AxiosInstance = useAxios();
  const errorHandler = useError();

  const requestConfig: AxiosRequestConfig = {
    url: allocateParamToString(urlGenerator(url), params),
    method: 'GET',
    params: merge(merge({page, per_page: perPage}, query), merge(search, dynamicParams?.search)),
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

  useEffect(() => {
    if (!isEmpty(compact(values(dynamicParams)))) {
      paginateQuery.refetch();
    }
  }, [dynamicParams]);

  const fetch = (params?: object, query?: object, search?: object) => {
    setDynamicParams({params, query, search});
  };

  return {...paginateQuery, refresh, data, meta, fetch};
};

export default usePagination;
