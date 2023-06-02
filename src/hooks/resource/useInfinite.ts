import {useEffect, useState} from 'react';
import {InfiniteData, useInfiniteQuery, useQueryClient} from 'react-query';
import get from 'lodash/get';
import set from 'lodash/set';
import merge from 'lodash/merge';
import concat from 'lodash/concat';
import reduce from 'lodash/reduce';
import {useAxios, useError, useUser} from 'hooks';
import {urlGenerator, allocateParamToString} from 'utils';
import compact from 'lodash/compact';
import isString from 'lodash/isString';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import values from 'lodash/values';
import isEmpty from 'lodash/isEmpty';
import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {responseProps} from 'types/request';
import {dynamicParams} from 'types/common';

interface IGetConfig {
  url: string;
  name?: Array<string | number | undefined | null> | string;
  infiniteKey?: string;
  staticKey?: string[];
  query?: object;
  search?: object;
  params?: object;
  version?: number;
  staleTime?: number;
  cacheTime?: number;
  initialData?: any;
  isGeneral?: boolean;
  enabled?: boolean;
  onSuccess?(data: InfiniteData<AxiosResponse>): void;
  onError?(error: AxiosError): void;
}
const useInfinite = ({
  url,
  name = 'notLongTimeAvailable',
  infiniteKey,
  staticKey,
  query,
  search,
  params,
  onSuccess,
  onError,
  version,
  initialData,
  isGeneral = false,
  enabled = false,
  staleTime = 180000,
  cacheTime = 600000
}: IGetConfig) => {
  let prettyName = isString(name) ? name : compact(name);
  if (prettyName === 'notLongTimeAvailable' || !isEmpty(search)) {
    prettyName = [];
    staleTime = 0;
    cacheTime = 0;
  }
  const queryClient = useQueryClient();
  const user = useUser();
  const AxiosInstance = useAxios();
  const errorHandler = useError();

  const [dynamicParams, setDynamicParams] = useState<dynamicParams | undefined>(undefined);

  const requestConfig: AxiosRequestConfig = {
    url: allocateParamToString(urlGenerator(url, version, isGeneral), merge(params, dynamicParams?.params)),
    method: 'GET',

    headers: {Authorization: user?.access_token ? `Bearer ${user?.access_token}` : ''}
  };

  const fetchData: any = ({pageParam = 1}) => {
    set(requestConfig, 'params', merge(merge({page: pageParam}, merge(query, dynamicParams?.query)), search));
    return AxiosInstance(requestConfig);
  };
  const infiniteQuery = useInfiniteQuery(prettyName, fetchData, {
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
    initialData,
    retry: errorHandler.handle,
    getPreviousPageParam: (lastPage: responseProps) => {
      if (get(lastPage, ['meta', 'current_page']) > 1) return lastPage.data.meta.current_page - 1;
      return false;
    },
    getNextPageParam: (lastPage: responseProps) => {
      if (get(lastPage, ['meta', 'current_page']) < get(lastPage, ['meta', 'last_page']))
        return lastPage.meta.current_page + 1;
      return false;
    }
  });
  const refresh = () => queryClient.invalidateQueries(prettyName);

  let data: Array<any> | any = {};

  if (infiniteKey && staticKey) {
    if (isArray(staticKey)) {
      forEach(staticKey, (key: string) => {
        set(data, key, get(infiniteQuery.data, ['pages', 0, 'data', key]));
      });
    } else if (isString(staticKey)) {
      set(data, staticKey, get(infiniteQuery.data, ['pages', 0, 'data', staticKey]));
    }
    set(
      data,
      infiniteKey,
      reduce(
        infiniteQuery.data?.pages,
        (allData: Array<any>, pageData: AxiosResponse) => concat(allData, get(pageData?.data, infiniteKey)),
        []
      )
    );
  } else {
    data = reduce(
      infiniteQuery.data?.pages,
      (allData: Array<any>, pageData: AxiosResponse) => concat(allData, pageData?.data),
      []
    );
  }

  useEffect(() => {
    if (!isEmpty(values(dynamicParams))) {
      infiniteQuery.remove();
      infiniteQuery.refetch();
    }
  }, [dynamicParams]);

  const fetch = (params?: object, query?: object) => {
    setDynamicParams({params, query});
  };

  return {
    ...infiniteQuery,
    refresh,
    fetch,
    data
  };
};

export default useInfinite;
