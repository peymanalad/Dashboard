import React from 'react';
import {Space} from 'antd';
import {useTranslation} from 'react-i18next';
import {DropDownMenu, MessageContainer} from 'components';
import {useParams, useHistory} from 'react-router-dom';
import {getLangSearchParam} from 'utils';
import {useInfinite} from 'hooks';
import get from 'lodash/get';

const SupportChat = () => {
  const {t} = useTranslation('message');
  const {user_id} = useParams<{user_id: string}>();
  const history = useHistory();

  const getMessageData = useInfinite({
    url: 'support_messages/fetch',
    name: ['support_message', user_id],
    staticKey: ['user'],
    infiniteKey: 'messages',
    query: {user_id},
    enabled: true
  });

  return (
    <MessageContainer
      getMessageData={getMessageData}
      urlName={['support_message', user_id]}
      messagesKey="messages"
      deleteUrl={`/support_messages/{id}?user_id=${user_id}`}
      updateUrl="/support_messages/{id}/"
      postUrl="/support_messages"
      useAdvancedComposer
      disableMentionUser
      cardTitle={
        get(getMessageData?.data, ['user', 'full_name']) || get(getMessageData?.data, ['user', 'username']) || ''
      }
      cardExtra={
        <Space size="small">
          <DropDownMenu
            items={[
              {
                name: t('file-show'),
                onClick: () => {
                  history.push(getLangSearchParam(`/visits/list?user_id=${user_id}`));
                },
                icon: ''
              },
              {
                name: t('user-show'),
                onClick: () => {
                  history.push(getLangSearchParam(`/user/show/${user_id}`));
                },
                icon: ''
              }
            ]}
          />
        </Space>
      }
    />
  );
};

export default SupportChat;
