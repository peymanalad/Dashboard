import React from 'react';
import {Button} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {MessageContainer} from 'components';
import {useParams, Link} from 'react-router-dom';
import {useInfinite} from 'hooks';
import get from 'lodash/get';

const SupportChat = () => {
  const {t} = useTranslation('message');
  const {user_id} = useParams<{user_id: string}>();

  const getMessageData = useInfinite({
    url: 'services/app/Chat/GetUserChatMessages?TenantId=1&',
    name: ['chatFriends', user_id],
    query: {UserId: user_id, TenantId: 1},
    enabled: true
  });

  return (
    <MessageContainer
      getMessageData={getMessageData}
      urlName={['chatFriends', user_id]}
      deleteUrl={`/support_messages/{id}?user_id=${user_id}`}
      updateUrl="/support_messages/{id}/"
      postUrl="/support_messages"
      useAdvancedComposer
      disableMentionUser
      disableReadyMessage
      disableVoice
      cardTitle={
        get(getMessageData?.data, ['user', 'full_name']) || get(getMessageData?.data, ['user', 'username']) || ''
      }
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
