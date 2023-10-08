import React, {FC} from 'react';
import {Button, Card, Space, Tooltip, Badge, Avatar} from 'antd';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {EditOutlined, UserOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {getImageUrl} from 'utils';
import toNumber from 'lodash/toNumber';

const SupportMessages: FC = () => {
  const {t} = useTranslation('message');

  const columns = [
    {
      title: t('user'),
      dataIndex: 'friendProfilePictureId',
      key: 'friendProfilePictureId',
      align: 'center',
      render: (friendProfilePictureId: string, friend: any) => (
        <Badge.Ribbon text={friend?.unreadMessageCount} placement="start" color="cyan">
          <Badge color="green" dot={!!friend?.isOnline}>
            <Avatar
              shape="square"
              size="large"
              draggable={false}
              className="bg-graydDark"
              src={friendProfilePictureId ? getImageUrl(friendProfilePictureId) : <UserOutlined />}
            />
          </Badge>
        </Badge.Ribbon>
      )
    },
    {
      title: t('username'),
      dataIndex: 'friendUserName',
      key: 'friendUserName',
      align: 'center'
    },
    {
      title: t('name'),
      dataIndex: 'friendName',
      key: 'friendName',
      align: 'center'
    },
    {
      title: t('last_name'),
      dataIndex: 'friendSurName',
      key: 'friendSurName',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: {view: boolean}, friend: any) => (
        <Space size={2}>
          <Tooltip title={t('reply_chat')}>
            <Link to={`/message/friend/${friend?.friendUserId}`}>
              <Button type="text" style={{color: '#035aa6'}} icon={<EditOutlined />} />
            </Link>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Card title={t('support_messages')}>
      <CustomTable
        fetch="services/app/Chat/GetUserChatFriendsWithSettings"
        dataName="chatFriends"
        path="friends"
        columns={columns}
        rowClassName={(chat) => `bg-${toNumber(chat?.count) > 0 ? 'inactive' : 'active'}`}
      />
    </Card>
  );
};

export default SupportMessages;
