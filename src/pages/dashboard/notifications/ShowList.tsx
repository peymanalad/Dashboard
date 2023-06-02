import React from 'react';
import {Card, Popover} from 'antd';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {userProps} from 'types/user';
import {convertUtcTimeToLocal} from 'utils';
import Text from 'antd/lib/typography/Text';

const ShowList = () => {
  const {t} = useTranslation('notifications');

  const renderContent = (content: string) => <Text style={{maxWidth: 300}}>{content}</Text>;

  const columns: any = [
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.username
    },
    {
      title: t('title'),
      dataIndex: 'data',
      key: 'title',
      align: 'center',
      render: (data: {title: string; message: string}) => (
        <Popover content={() => renderContent(data.message)}>
          <Text>{data.title || '-'}</Text>
        </Popover>
      )
    },
    {
      title: t('sendDate'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (dateTime: string) => convertUtcTimeToLocal(dateTime)
    }
  ];

  return (
    <Card className="my-6" title={t('notifications')}>
      <CustomTable
        fetch="notifications/paginate"
        dataName="patientComments"
        rowClassName={(record) => `bg-${record?.read_at ? 'active' : 'inactive'}`}
        columns={columns}
      />
    </Card>
  );
};
export default ShowList;
