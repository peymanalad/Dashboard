import React, {FC} from 'react';
import {Button, Card, Space, Tooltip, Badge} from 'antd';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {EditOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {convertTimeToLocalMoment} from 'utils';
import toNumber from 'lodash/toNumber';
import {userProps} from 'types/user';

const SupportMessages: FC = () => {
  const {t} = useTranslation('message');

  const columns = [
    {
      title: t('full_name'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps, message: any) => (
        <Badge.Ribbon text={message?.count} placement="start" color="cyan">
          {user?.full_name || user?.username || '-'}
        </Badge.Ribbon>
      )
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (value: string) => (value ? convertTimeToLocalMoment(value)?.fromNow() : '-')
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: {view: boolean}, chat: any) => (
        <Space size={2}>
          {permissions?.view && (
            <Tooltip title={t('reply_chat')}>
              <Link to={`/message/support/chat/${chat?.user?.id}`}>
                <Button type="text" style={{color: '#035aa6'}} icon={<EditOutlined />} />
              </Link>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card title={t('support_messages')}>
      <CustomTable
        fetch="support_messages/paginate"
        dataName="supportMessages"
        columns={columns}
        rowClassName={(chat) => `bg-${toNumber(chat?.count) > 0 ? 'inactive' : 'active'}`}
      />
    </Card>
  );
};

export default SupportMessages;
