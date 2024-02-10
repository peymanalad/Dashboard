import React from 'react';
import {Button} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {MessageContainer} from 'components';
import {useParams, Link, useLocation} from 'react-router-dom';
import {useInfinite, useUser} from 'hooks';

const SupportChat = () => {
  const {t} = useTranslation('message');
  const user = useUser();
  const {user_id} = useParams<{user_id: string}>();
  const location = useLocation<any>();
  const friend = location.state;

  const getMessageData = useInfinite({
    url: 'services/app/Chat/GetPagedUserChatMessages?TenantId=1&',
    name: ['chatFriends', user_id],
    query: {UserId: user_id, TenantId: 1, MaxResultCount: 50},
    enabled: true
  });

  return (
    <MessageContainer
      getMessageData={getMessageData}
      urlName={['chatFriends', user_id]}
      myUserID={user.getId()}
      friendUserID={+user_id}
      deleteUrl={`/support_messages/{id}?user_id=${user_id}`}
      updateUrl="/support_messages/{id}/"
      postUrl="/support_messages"
      hasReply
      useAdvancedComposer
      disableMentionUser
      disableReadyMessage
      disableVoice
      cardTitle={`${friend?.friendName || friend?.name || ''} ${friend?.friendSurName || friend?.surname || ''}`}
      cardExtra={
        <Link to={`/user/edit/${user_id}`}>
          <Button className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset" icon={<UserOutlined />}>
            {t('user-show')}
          </Button>
        </Link>
      }
    />
  );
};

export default SupportChat;
