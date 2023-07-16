import React, {useState, useEffect, memo, useRef, useCallback, useMemo, ReactNode, ElementRef} from 'react';
import {Card, Row, Space, Spin, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {SimpleComposer, AdvancedComposer, MessageChat} from 'components';
import {usePost, useUser} from 'hooks';
import {useParams} from 'react-router-dom';
import {EmptyMessage} from 'assets';
import {chatMessageProps, replyUpdateProps, chatStatus, chatType, updateMessageProps, commentType} from 'types/message';
import {useQueryClient} from 'react-query';
import * as Scroll from 'react-scroll';
import cloneWith from 'lodash/cloneWith';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import set from 'lodash/set';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import toString from 'lodash/toString';
import flattenDeep from 'lodash/flattenDeep';
import {uploadAdvancedInputType} from 'types/file';
import {userProps} from 'types/user';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

export interface props {
  getMessageData: any;
  urlName: Array<string | number | undefined | null> | string;
  myUserID?: number;
  messagesKey?: string;
  postUrl: string;
  uploadType?: uploadAdvancedInputType;
  commentType?: commentType;
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
  messagesKey = '',
  uploadType = 'messages',
  commentType,
  postUrl,
  updateUrl,
  deleteUrl,
  confirmUrl = '',
  rejectUrl = '',
  readUrl = '',
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

  const [reply, setReply] = useState<replyUpdateProps | undefined>(undefined);
  const [searchRef, setSearchRef] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<number | undefined>(undefined);

  const messages = useMemo(() => {
    return (messagesKey ? flattenDeep(get(getMessageData?.data, messagesKey)) : getMessageData?.data)?.slice(0);
  }, [getMessageData.data, messagesKey]);

  const updateMessage = useCallback(
    (changesMessage: updateMessageProps, chatId: number | string) => {
      queryClient.setQueryData(urlName, (responses: any) =>
        cloneWith(responses, (value: {pages: any[]}) => {
          forEach(value?.pages, (response: object, index: number) => {
            const messageIndex = findIndex(get(response, messagesKey ? ['data', messagesKey] : ['data']), [
              'id',
              chatId
            ]);
            if (messageIndex > -1) {
              const oldMessage = get(
                value,
                messagesKey
                  ? ['pages', index, 'data', messagesKey, messageIndex]
                  : ['pages', index, 'data', messageIndex]
              );
              set(
                value,
                messagesKey
                  ? ['pages', index, 'data', messagesKey, messageIndex]
                  : ['pages', index, 'data', messageIndex],
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

  const setSearch = useCallback((isSearch: boolean) => {
    setSearchRef(isSearch);
  }, []);

  const setReplyData = useCallback((replyData) => {
    setReply(replyData);
  }, []);

  const addToMessages = useCallback(
    (
      message: any
      // parent: replyUpdateProps | undefined,
      // status: chatStatus,
      // ChatID: number | string
    ) => {
      queryClient.setQueryData(urlName, (responses: any) =>
        cloneWith(responses, (value: any[]) => {
          (
            get(value, messagesKey ? ['pages', 0, 'data', 'items', messagesKey] : ['pages', 0, 'data', 'items']) || []
          ).push(message);
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
      .withUrl(`wss://api.ideed.ir/signalr-chat?enc_auth_token=${encodeURIComponent(user.encrypted_access_token!)}`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    connection.current
      .start()
      .then(() => {
        console.log('SignalR connection established.');
      })
      .catch((error) => console.error('Error starting SignalR connection:', error));

    connection.current.on('getChatMessage', (message) => {
      console.log('app.chat.messageReceived', message);
      addToMessages(message);
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

  // const postChat = usePost({
  //   url: postUrl,
  //   method: 'POST',
  //   onSuccess: () => {
  //     getMessageData.refetch();
  //   },
  //   onError: () => {
  //     updateMessage({content: inputRef?.current?.getContent(), status: 'error'}, 'newMessage');
  //   }
  // });

  const updateChat = usePost({
    url: updateUrl,
    method: 'PATCH',
    onSuccess: (response: any, request: any, params: {id: number}) => {
      updateMessage({status: 'done'}, params?.id);
    },
    onError: (err: any, data: any, params: {id: number}) => {
      updateMessage({status: 'error'}, params?.id);
    }
  });

  const deleteMessage = usePost({
    url: deleteUrl,
    method: 'DELETE',
    onSuccess() {
      setLoadingId(undefined);
      getMessageData.refetch();
    },
    onError() {
      setLoadingId(undefined);
    }
  });

  const confirmMessage = usePost({
    url: confirmUrl,
    method: 'POST',
    onSuccess: () => {
      setLoadingId(undefined);
      getMessageData.refetch();
    },
    onError() {
      setLoadingId(undefined);
    }
  });

  const rejectMessage = usePost({
    url: rejectUrl,
    method: 'POST',
    onSuccess: () => {
      setLoadingId(undefined);
      getMessageData.refetch();
    },
    onError() {
      setLoadingId(undefined);
    }
  });

  const readMessage = usePost({
    url: readUrl,
    method: 'POST',
    onSuccess: () => {
      setLoadingId(undefined);
      getMessageData.refetch();
    },
    onError() {
      setLoadingId(undefined);
    }
  });

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
    reply: replyUpdateProps | undefined,
    type: chatType | commentType,
    file?: File
  ) => {
    const sendData = {
      content: message,
      type: type === 'audio' ? 'sound' : type,
      patient_id,
      doctor_id,
      recommendation_id,
      user_id,
      reply_id
      // meta: {mentions: map(mentions, 'id')}
    };
    if (reply?.isReply === false) {
      updateChat.post(sendData, undefined, {id: reply?.id});
    } else {
      console.log(message, file);
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

  const getReplyData = async (replyData: replyUpdateProps) => {
    setSearch(true);
    let ReplyComment: chatMessageProps[] = filter(messages, (comment: chatMessageProps) => comment.id === replyData.id);
    if (ReplyComment?.length) JumpToComment(toString(replyData.id));
    else {
      while (getMessageData.canFetchMore && !ReplyComment.length) {
        await getMessageData?.fetchMore();
        ReplyComment = filter(messages, (comment: chatMessageProps) => comment.id === replyData.id);
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
            {map(messages, (message: chatMessageProps, index: number) => (
              <MessageChat
                data={message}
                key={index.toString()}
                myUserID={myUserID}
                before={get(messages, index - 1)}
                after={get(messages, index + 1)}
                getReply={getReplyData}
                hasReply={hasReply}
                actionLoading={
                  loadingId === message?.id &&
                  (deleteMessage.isLoading ||
                    confirmMessage.isLoading ||
                    rejectMessage.isLoading ||
                    readMessage.isLoading)
                }
                onDeleteClick={(id) => {
                  setLoadingId(id);
                  deleteMessage.post({recommendation_id}, {}, {id});
                }}
                onConfirmClick={(id) => {
                  setLoadingId(id);
                  confirmMessage.post({recommendation_id}, {}, {id});
                }}
                onRejectClick={(id) => {
                  setLoadingId(id);
                  rejectMessage.post({recommendation_id}, {}, {id});
                }}
                onReadClick={(id) => {
                  setLoadingId(id);
                  readMessage.post({recommendation_id}, {}, {id});
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
              if (reply?.isReply === false) updateMessage({content, status: 'loading'}, reply?.id);
              // else addToMessages(content, reply, 'loading', 'newMessage', mentions);
            }}
            onError={() => {
              updateMessage({content: inputRef?.current?.getContent(), status: 'error'}, 'newMessage');
            }}
            onSend={(message: string, type: chatType, file?: File) => {
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
              if (reply?.isReply === false) updateMessage({content, status: 'loading'}, reply?.id);
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
