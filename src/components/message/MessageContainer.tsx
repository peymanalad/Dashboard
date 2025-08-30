import React, {useState, useEffect, memo, useRef, useCallback, useMemo, ReactNode, ElementRef} from 'react';
import {Card, Row, Space, Spin, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {SimpleComposer, AdvancedComposer, MessageChat} from 'components';
import {usePost, useUser} from 'hooks';
import {useParams} from 'react-router-dom';
import {EmptyMessage} from 'assets';
import {useQueryClient} from 'react-query';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import * as Scroll from 'react-scroll';
import cloneWith from 'lodash/cloneWith';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import set from 'lodash/set';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import toString from 'lodash/toString';
import flattenDeep from 'lodash/flattenDeep';
import isString from 'lodash/isString';
import {normalizeMessage} from 'utils/message';
import {windowProcess} from 'utils/process';
import type {IChatMessageProps, IReplyUpdateProps, ChatType, CommentType} from 'types/message';
import type {UploadAdvancedInputType} from 'types/file';
import type {userProps} from 'types/user';

export interface props {
  getMessageData: any;
  urlName: Array<string | number | undefined | null> | string;
  myUserID?: number;
  friendUserID?: number;
  messagesKey?: string;
  postUrl: string;
  uploadType?: UploadAdvancedInputType;
  commentType?: CommentType;
  updateUrl: string;
  deleteUrl: string;
  confirmUrl?: string;
  rejectUrl?: string;
  readUrl?: string;
  hasReply?: boolean;
  cardTitle?: ReactNode;
  cardExtra?: ReactNode;
  useAdvancedComposer?: boolean;
  disableEmoji?: boolean;
  disableReadyMessage?: boolean;
  disableVoice?: boolean;
  disableMentionUser?: boolean;
}

const {Text} = Typography;

const MessageContainer = ({
  getMessageData,
  urlName,
  myUserID,
  friendUserID,
  messagesKey = '',
  uploadType = 'messages',
  commentType,
  cardTitle,
  cardExtra,
  hasReply,
  useAdvancedComposer,
  disableEmoji,
  disableReadyMessage,
  disableVoice,
  disableMentionUser
}: props) => {
  const {t} = useTranslation('message');
  const connection = useRef<HubConnection>();
  const {recommendation_id, patient_id, doctor_id, user_id, reply_id} = useParams<{
    recommendation_id?: string;
    patient_id?: string;
    doctor_id?: string;
    user_id?: string;
    reply_id?: string;
  }>();
  const user = useUser();
  const queryClient = useQueryClient();
  const inputRef = useRef<ElementRef<typeof AdvancedComposer>>(null);
  const UserId: number = myUserID || user.getId();

  const [reply, setReply] = useState<IReplyUpdateProps | undefined>(undefined);
  const [searchRef, setSearchRef] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<number | string | undefined>(undefined);

  const messages = useMemo(() => {
    return (messagesKey ? flattenDeep(get(getMessageData?.data, messagesKey)) : getMessageData?.data)?.slice(0);
  }, [getMessageData.data, messagesKey]);

  const postReadMessages = usePost({
    url: 'services/app/Chat/MarkAllUnreadMessagesOfUserAsRead',
    method: 'POST',
    showError: false
  });

  const readMessages = () => {
    postReadMessages.post({userId: friendUserID, tenantId: 1});
  };

  const updateMessage = useCallback(
    (changesMessage: any, chatId: number | string) => {
      queryClient.setQueryData(urlName, (responses: any) =>
        cloneWith(responses, (value: {pages: any[]}) => {
          forEach(value?.pages, (response: object, index: number) => {
            const messages =
              get(value, messagesKey ? ['pages', 0, 'data', 'items', messagesKey] : ['pages', 0, 'data', 'items']) ||
              [];
            const messageIndex = findIndex(messages, ['sharedMessageId', chatId]);
            if (messageIndex > -1) {
              const oldMessage = get(
                value,
                messagesKey
                  ? ['pages', 0, 'data', 'items', messagesKey, messageIndex]
                  : ['pages', 0, 'data', 'items', messageIndex]
              );
              set(
                value,
                messagesKey
                  ? ['pages', 0, 'data', 'items', messagesKey, messageIndex]
                  : ['pages', 0, 'data', 'items', messageIndex],
                {
                  ...oldMessage,
                  ...changesMessage
                }
              );
            }
          });
          return value;
        })
      );
    },
    [messagesKey, queryClient, urlName]
  );

  const deleteMessage = useCallback(
    (messageId: number) => {
      queryClient.setQueryData(urlName, (responses: any) =>
        cloneWith(responses, (value: any[]) => {
          const messages =
            get(value, messagesKey ? ['pages', 0, 'data', 'items', messagesKey] : ['pages', 0, 'data', 'items']) || [];
          remove(messages, ['sharedMessageId', messageId]);
          set(
            value,
            messagesKey ? ['pages', 0, 'data', 'items', messagesKey] : ['pages', 0, 'data', 'items'],
            messages
          );
          return value;
        })
      );
      // if (status === 'loading') setReplyData(undefined);
    },
    [UserId, messagesKey, urlName]
  );

  const setSearch = useCallback((isSearch: boolean) => {
    setSearchRef(isSearch);
  }, []);

  const setReplyData = useCallback((replyData) => {
    setReply(replyData);
  }, []);

  const addToMessages = useCallback(
    (message: any) => {
      const msgNormalize = normalizeMessage(message);
      queryClient.setQueryData(urlName, (responses: any) =>
        cloneWith(responses, (value: any[]) => {
          let messages =
            get(value, messagesKey ? ['pages', 0, 'data', 'items', messagesKey] : ['pages', 0, 'data', 'items']) || [];
          if (msgNormalize?.type !== 'text')
            messages = messages?.filter(
              (msg: any) => !msg?.status && msg?.content?.name !== msgNormalize?.content?.name
            );
          messages.push(message);
          set(
            value,
            messagesKey ? ['pages', 0, 'data', 'items', messagesKey] : ['pages', 0, 'data', 'items'],
            messages
          );
          return value;
        })
      );
      // if (status === 'loading') setReplyData(undefined);
    },
    [UserId, messagesKey, urlName]
  );

  useEffect(() => {
    connection.current = new HubConnectionBuilder()
      // .configureLogging(LogLevel.Debug)
      .withUrl(
        `${windowProcess('REACT_APP_BASE_URL')?.replace(
          'https',
          'wss'
        )}/signalr-chat?enc_auth_token=${encodeURIComponent(user.encrypted_access_token!)}`,
        {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets
        }
      )
      .withAutomaticReconnect()
      .build();

    connection.current
      .start()
      .then(() => {
        console.log('SignalR connection established.');
        readMessages();
      })
      .catch((error) => console.error('Error starting SignalR connection:', error));

    connection.current.on('getChatMessage', (message) => {
      console.log('app.chat.messageReceived', message);
      addToMessages(message);
      readMessages();
    });

    connection.current.on('deleteChatMessage', (messageId) => {
      console.log('app.chat.deleteChatMessage', messageId);
      deleteMessage(messageId);
    });

    connection.current.on('editChatMessage', (id, message) => {
      console.log('app.chat.editChatMessageReceived', id, message);
      updateMessage({message}, id);
    });

    connection.current.on('getAllFriends', (friends) => {
      console.log('abp.chat.friendListChanged', friends);
    });

    connection.current.on('getFriendshipRequest', (friendData, isOwnRequest) => {
      console.log('app.chat.friendshipRequestReceived', friendData, isOwnRequest);
    });

    connection.current.on('getUserConnectNotification', (friend, isConnected) => {
      console.log('app.chat.userConnectionStateChanged');
    });

    return () => {
      connection?.current?.stop();
    };
  }, []);

  useEffect(() => {
    Scroll.Events.scrollEvent.register('end', (to, element) => {
      element.classList.add('find');
      setTimeout(() => {
        element.classList.remove('find');
      }, 1000);
    });

    // returned function will be called on component unmount
    return () => {
      Scroll.Events.scrollEvent.remove('end');
    };
  }, []);

  const onStoreMessage = (
    message: string | File,
    reply: IReplyUpdateProps | undefined,
    type: ChatType | CommentType,
    file?: File
  ) => {
    if (reply?.isReply === false) {
      connection.current?.invoke('editMessage', {
        sharedMessageId: reply?.id,
        message: !!file
          ? `[${type}]${JSON.stringify({id: message, contentType: file?.type, name: file?.name})}`
          : message,
        userId: +user_id!,
        tenantId: 1
      });
      // updateChat.post(sendData, undefined, {id: reply?.id.});
    } else {
      // set(sendData, 'reply_id', reply?.id || reply_id);
      connection.current?.invoke('sendMessage', {
        message: !!file
          ? `[${type}]${JSON.stringify({id: message, contentType: file?.type, name: file?.name})}`
          : message,
        userId: +user_id!,
        tenantId: 1
      });
      // postChat.post(sendData);
    }
    setReply(undefined);
  };

  const onPopupScroll = (e: any) => {
    const {target} = e;
    if (
      -target.scrollTop + target.offsetHeight + 2 >= target.scrollHeight &&
      !getMessageData?.isFetchingNextPage &&
      getMessageData?.hasNextPage
    ) {
      getMessageData.fetchNextPage();
    }
  };

  const JumpToComment = (id: string) => {
    setSearch(false);
    Scroll.scroller.scrollTo(id, {
      duration: 1500,
      delay: 100,
      smooth: true,
      containerId: 'ScrollBar',
      offset: -50 // Scrolls to element + 50 pixels down the page
    });
  };

  const getReplyData = async (replyData: IReplyUpdateProps) => {
    setSearch(true);
    let ReplyComment: IChatMessageProps[] = filter(
      messages,
      (comment: IChatMessageProps) => comment.id === replyData.id
    );
    if (ReplyComment?.length) JumpToComment(toString(replyData.id));
    else {
      while (getMessageData.canFetchMore && !ReplyComment.length) {
        await getMessageData?.fetchMore();
        ReplyComment = filter(messages, (comment: IChatMessageProps) => comment.id === replyData.id);
        if (!isEmpty(ReplyComment)) return JumpToComment(toString(replyData.id));
      }
    }
  };
  return (
    <Card className="w-full chat h-full" bordered={false} title={cardTitle} extra={cardExtra}>
      {!getMessageData.isFetching && isEmpty(messages) && (
        <Space className="message__empty">
          <EmptyMessage />
          <Text type="secondary" className="cursor-default">
            {t('messages.no_messages')}
          </Text>
        </Space>
      )}
      <section className="chat_body">
        <Row className="vertical-scroll-container" onScroll={onPopupScroll} id="ScrollBar">
          <Row className="messages">
            <Row
              className={`w-full h-full items-center chat__loader ${searchRef ? 'search__ref' : ''} ${
                !getMessageData.isLoading ? 'd-none' : ''
              }`}>
              <Spin tip={t('loading')} />
            </Row>
            {getMessageData?.isFetchingNextPage && (
              <Row className="w-full items-center chat__loader">
                <Spin tip={t('loadingNextPage')} />
              </Row>
            )}
            {map(messages, (message: IChatMessageProps, index: number) => (
              <MessageChat
                data={message}
                key={`${index}`}
                myUserID={myUserID}
                before={get(messages, index - 1)}
                after={get(messages, index + 1)}
                getReply={getReplyData}
                hasReply={hasReply}
                hasDelete
                hasUpdate
                onDeleteClick={(sharedMessageId: string) => {
                  setLoadingId(sharedMessageId);
                  connection.current?.invoke('DeleteMessage', {
                    sharedMessageId,
                    userId: +user_id!,
                    tenantId: 1
                  });
                }}
                onConfirmClick={(id) => {
                  // setLoadingId(id);
                  // confirmMessage.post({recommendation_id}, {}, {id});
                }}
                onRejectClick={(id) => {
                  // setLoadingId(id);
                  // rejectMessage.post({recommendation_id}, {}, {id});
                }}
                onReadClick={(id) => {
                  // setLoadingId(id);
                  // readMessage.post({recommendation_id}, {}, {id});
                }}
                setReply={setReplyData}
              />
            ))}
          </Row>
        </Row>
        {useAdvancedComposer ? (
          <AdvancedComposer
            ref={inputRef}
            reply={reply}
            uploadType={uploadType}
            replyEmpty={() => {
              setReplyData(undefined);
            }}
            disabled={get(getMessageData?.data, [0, 'permissions', 'store']) === false}
            disableEmoji={disableEmoji}
            disableMentionUser={disableMentionUser}
            disableReadyMessage={disableReadyMessage}
            disableVoice={disableVoice}
            // loading={postChat.isLoading}
            onClick={(content: string | File, mentions?: userProps[]) => {
              if (!isString(content))
                addToMessages({
                  type: content?.type?.split('/')?.[0],
                  content,
                  status: 'loading',
                  userId: myUserID,
                  side: 1,
                  targetUserId: friendUserID
                });
              // if (reply?.isReply === false) updateMessage({content, status: 'loading'}, reply?.id);
              // else addToMessages(content, reply, 'loading', 'newMessage', mentions);
            }}
            onError={() => {
              // updateMessage({content: inputRef?.current?.getContent(), status: 'error'}, 'newMessage');
            }}
            onSend={(message: string, type: ChatType, file?: File) => {
              onStoreMessage(message, reply, commentType || type, file);
            }}
          />
        ) : (
          <SimpleComposer
            // loading={postChat.isLoading}
            reply={reply}
            replyEmpty={() => {
              setReplyData(undefined);
            }}
            onSend={(content: string) => {
              // if (reply?.isReply === false) updateMessage({content, status: 'loading'}, reply?.id);
              // else addToMessages(content, reply, 'loading', 'newMessage');
              onStoreMessage(content, reply, commentType || 'text');
            }}
          />
        )}
      </section>
    </Card>
  );
};

export default memo(MessageContainer);
