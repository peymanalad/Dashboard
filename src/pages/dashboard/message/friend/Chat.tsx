import React, {useEffect} from 'react';
import {Space} from 'antd';
import {useTranslation} from 'react-i18next';
import {DropDownMenu, MessageContainer} from 'components';
import {useParams, useHistory} from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import {getLangSearchParam} from 'utils';
import {useInfinite} from 'hooks';
import get from 'lodash/get';

const SupportChat = () => {
  const {t} = useTranslation('message');
  const {user_id} = useParams<{user_id: string}>();
  const history = useHistory();

  const getMessageData = useInfinite({
    url: 'services/app/Chat/GetUserChatMessages?TenantId=1&',
    name: ['chatFriends', user_id],
    query: {UserId: user_id, TenantId: 1},
    enabled: true
  });

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/signalr') // Replace with your SignalR hub URL
      .build();

    connection
      .start()
      .then(() => {
        console.log('SignalR connection established.');
      })
      .catch((error) => console.error('Error starting SignalR connection:', error));

    // Define message handling
    connection.on('ReceiveMessage', (message) => {
      console.log('Message received:', message);
      // Do something with the received message in your React component
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <MessageContainer
      getMessageData={getMessageData}
      urlName={['chatFriends', user_id]}
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
