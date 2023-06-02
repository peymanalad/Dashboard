import React from 'react';
import {Button, Card, Popover, Tooltip} from 'antd';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {userProps} from 'types/user';
import {convertUtcTimeToLocal} from 'utils';
import Text from 'antd/lib/typography/Text';
import {Link} from 'react-router-dom';
import {EyeOutlined} from '@ant-design/icons';

const ShowList = () => {
  const {t} = useTranslation('notifications');

  const renderContent = (content: string) => <Text style={{maxWidth: 300}}>{content}</Text>;

  const columns: any = [
    {
      title: t('sender'),
      dataIndex: 'sender',
      key: 'sender',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.username
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
      // render: (data: {title: string; message: string}) => (
      //   <Popover content={() => renderContent(data.message)}>
      //     <Text>{data.title || '-'}</Text>
      //   </Popover>
      // )
    },
    {
      title: t('count'),
      dataIndex: 'count',
      key: 'count',
      align: 'center'
      // render: (data: {title: string; message: string}) => (
      //   <Popover content={() => renderContent(data.message)}>
      //     <Text>{data.title || '-'}</Text>
      //   </Popover>
      // )
    },
    {
      title: t('sendDate'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (dateTime: string) => convertUtcTimeToLocal(dateTime)
    },
    {
      title: t('action'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (id: any) => (
        <Tooltip title={t('view')}>
          <Link to={`/notifications/group/${id}`}>
            <Button type="text" icon={<EyeOutlined style={{color: '#f6830f'}} />} />
          </Link>
        </Tooltip>
        // <Button icon={<EyeOutlined className="text-orangeDark" />} href={`/notifications/group/${id}`} />
      )
    }
  ];

  return (
    <Card className="my-6" title={t('notifications')}>
      <CustomTable
        fetch="group_notifications/paginate"
        dataName="group_notifications"
        // rowClassName={(record) => `bg-${record?.read_at ? 'active' : 'inactive'}`}
        columns={columns}
      />
    </Card>
  );
};
export default ShowList;
