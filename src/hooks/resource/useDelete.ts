import {Modal} from 'antd';
import {useTranslation} from 'react-i18next';
import {usePost} from 'hooks';
import isFunction from 'lodash/isFunction';
import {renderLabel} from 'utils';
import {useQueryClient} from 'react-query';

interface IPostConfig {
  name: Array<string | number | undefined | null> | string;
  url: string;
  version?: number;
  isGeneral?: boolean;
  titleKey?: string | string[][] | string[];
  onSuccess?(): void;
  onError?(error: any, request?: any, params?: any): void;
}

const useDelete = ({name, titleKey = 'name', url, onSuccess, onError}: IPostConfig) => {
  const {t} = useTranslation('general');
  const queryClient = useQueryClient();

  const deleteRequest = usePost({
    url,
    method: 'DELETE',
    onSuccess: () => {
      queryClient.refetchQueries(name);
      if (isFunction(onSuccess)) onSuccess();
    },
    onError
  });

  const show = (params: object, query?: object) => {
    Modal.error({
      title: t('delete'),
      content: t('messages.delete', {name: renderLabel(params, titleKey)}),
      okType: 'danger',
      centered: true,
      okText: t('delete'),
      className: 'delete',
      cancelText: t('cancel'),
      okCancel: true,
      onOk: () => deleteRequest.post({}, query, params)
    });
  };

  return {show, ...deleteRequest};
};

export default useDelete;
