import {AxiosError, AxiosRequestConfig} from 'axios';
import {allocateParamToString, urlGenerator} from 'utils';
import {useMutation, useQueryClient} from 'react-query';
import {useAxios, useError, useUser} from 'hooks';
import merge from 'lodash/merge';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import forEach from 'lodash/forEach';
import {MutationRequestProps} from 'types/request';

interface IPostConfig {
  url: string;
  query?: object;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'GET';
  removeQueries?: Array<Array<string | number | undefined | null> | string>;
  refetchQueries?: Array<Array<string | number | undefined | null> | string>;
  form?: any;
  isGeneral?: boolean;
  isMultipart?: boolean;
  showError?: boolean;
  retry?: boolean | number;
  onSuccess?(response: any, request?: any, params?: any): void;
  onError?(error: any, request?: any, params?: any): void;
  isUrlencoded?: boolean;
  timeout?: number;
}

const usePost = ({
  url,
  method = 'POST',
  query,
  form,
  isMultipart,
  showError = true,
  removeQueries,
  isUrlencoded = false,
  retry = false,
  refetchQueries,
  onSuccess,
  onError,
  timeout
}: IPostConfig) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const AxiosInstance = useAxios();
  const errorHandler = useError({form});

  const requestConfig: AxiosRequestConfig = {
    timeout: timeout || 60000,
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
      'Content-type': isMultipart
        ? 'multipart/form-data'
        : isUrlencoded
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
      silent: !showError
    },

    url: urlGenerator(url),
    method,
    params: query
  };

  const createRequest = ({body, queryParams, params, token}: MutationRequestProps) => {
    if (queryParams) set(requestConfig, 'params', merge(query, queryParams));
    if (token) set(requestConfig, ['headers', 'Authorization'], `Bearer ${token}`);
    if (params) set(requestConfig, 'url', allocateParamToString(urlGenerator(url), params));
    set(requestConfig, 'data', body);
    return AxiosInstance(requestConfig);
  };

  const mutationData = useMutation(createRequest, {
    retry,
    retryDelay: 0,
    onSuccess: (data, variables) => {
      forEach(removeQueries, (removeQuery: Array<string | number | undefined | null> | string) =>
        queryClient.removeQueries(removeQuery)
      );
      forEach(refetchQueries, (refetchQuery: Array<string | number | undefined | null> | string) =>
        queryClient.refetchQueries(refetchQuery)
      );
      if (isFunction(onSuccess)) {
        onSuccess(data?.data, variables, variables?.params);
      }
    },
    onError: (error: AxiosError, variables) => {
      errorHandler.handle(0, error);
      if (isFunction(onError)) {
        onError(error.request, variables, variables?.params);
      }
    }
  });

  const post = (body?: any, queryParams?: object, params?: object, token?: string) =>
    mutationData.mutate({body, queryParams, params, token});

  return {...mutationData, post, params: mutationData.variables?.params};
};

export default usePost;
