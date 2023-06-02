import React, {FC} from 'react';
import {Card} from 'antd';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {getLangSearchParam} from 'utils';
import {MessageOutlined, FileSearchOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router-dom';
import {DropDownMenu, ShowItems} from 'components';

interface Props {
  id?: string;
}

const ShowAccountInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('user-show');
  const history = useHistory();

  const fetchUser = useFetch({
    url: 'users/{id}/view',
    name: ['user', 'view', id],
    params: {id},
    enabled: true
  });

  const getFirstKey = (roleID: number) => {
    if (roleID === 6 || roleID === 10 || roleID === 12)
      return ['name', 'role', 'avatar', 'city', 'province', 'country'];
    return ['first_name', 'last_name', 'role', 'avatar', 'city', 'province', 'country'];
  };

  return (
    <Card
      title={t('title_show')}
      bordered={false}
      loading={fetchUser.isFetching}
      extra={
        <DropDownMenu
          items={[
            {
              name: t('user-visits'),
              onClick: () => {
                history.push(getLangSearchParam(`/visits/list?user_id=${id}`));
              },
              icon: <FileSearchOutlined />
            },
            {
              name: t('user-support'),
              onClick: () => {
                history.push(getLangSearchParam(`/message/support/chat/${id}`));
              },
              icon: <MessageOutlined />
            }
          ]}
        />
      }>
      <ShowItems firstKeysShow={getFirstKey(fetchUser?.data?.role?.id)} data={fetchUser?.data} t={t} />
    </Card>
  );
};

export default ShowAccountInfo;
