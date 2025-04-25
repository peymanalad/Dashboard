import {AxiosError, AxiosRequestConfig, AxiosResponse, ResponseType} from 'axios';
import {useQuery} from 'react-query';
import {useEffect, useState} from 'react';
import {allocateParamToString, urlGenerator} from 'utils';
import get from 'lodash/get';
import compact from 'lodash/compact';
import {useError, useUser, useAxios} from 'hooks';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import merge from 'lodash/merge';
import {IDynamicParams} from 'types/common';

interface IGetConfig {
  url: string;
  name?: Array<string | number | undefined | null> | string;
  query?: object;
  params?: object;
  version?: number;
  staleTime?: number;
  cacheTime?: number;
  showError?: boolean;
  isGeneral?: boolean;
  responseType?: ResponseType;
  enabled?: boolean;
  onSuccess?(data: AxiosResponse): void;
  onError?(error: AxiosError): void;
}
const useFetch = ({
  url,
  name = 'notLongTimeAvailable',
  query,
  params,
  showError = true,
  onSuccess,
  onError,
  responseType,
  enabled = false,
  staleTime = 1800000,
  cacheTime = 6000000
}: IGetConfig) => {
  const prettyName = isString(name) ? name : compact(name);
  if (prettyName === 'notLongTimeAvailable') {
    staleTime = 0;
    cacheTime = 0;
  }
  const user = useUser();
  const AxiosInstance = useAxios();
  const errorHandler = useError();

  const [dynamicParams, setDynamicParams] = useState<IDynamicParams | undefined>(undefined);

  const requestConfig: AxiosRequestConfig = {
    headers: {Authorization: user?.access_token ? `Bearer ${user?.access_token}` : '', silent: !showError},
    responseType,
    url: allocateParamToString(urlGenerator(url), merge(params, dynamicParams?.params)),
    method: 'GET',
    params: merge(query, dynamicParams?.query)
  };

  const fetchData = useQuery(prettyName, () => AxiosInstance(requestConfig), {
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

  useEffect(() => {
    if (!isEmpty(values(dynamicParams))) {
      fetchData.refetch();
    }
  }, [dynamicParams]);

  const fetch = (params?: object, query?: object) => {
    setDynamicParams({params, query});
  };

  const refresh = () => fetchData.remove();
  const data = get(fetchData, ['data', 'data']);
  const schema = get(fetchData, ['data', 'schema']);
  return {...fetchData, refresh, fetch, data, schema};
};

export default useFetch;
