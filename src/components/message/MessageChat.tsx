import React, {memo} from 'react';
import {chatMessageProps, replyUpdateProps} from 'types/message';
import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Col, ConfigProvider, Divider, Space, Typography, Image, Avatar, Tooltip, Modal} from 'antd';
import {useTranslation} from 'react-i18next';
import {chatImageDefault, Drop, colors, PrescriptionIcon} from 'assets';
import * as Scroll from 'react-scroll';
import AudioPlayer from 'react-h5-audio-player';
import {convertUtcTimeToLocal} from 'utils';
import {MessageActions} from 'components';
import map from 'lodash/map';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {userProps} from 'types/user';
import {useUser} from 'hooks';
import toString from 'lodash/toString';
import {includes} from 'lodash';
import Linkify from 'linkify-react';

export interface props {
  data: chatMessageProps;
  before?: chatMessageProps;
  after?: chatMessageProps;
  myUserID?: number;
  setReply?: (parent: replyUpdateProps) => void;
  getReply?: (parent: replyUpdateProps) => void;
  actionLoading?: boolean;
  onDeleteClick: (id: number) => void;
  onRejectClick: (id?: number) => void;
  onReadClick: (id?: number) => void;
  onConfirmClick: (id?: number) => void;
  hasReply?: boolean;
  hasUpdate?: boolean;
  hasDelete?: boolean;
  hasConfirm?: boolean;
  hasReject?: boolean;
  hasRead?: boolean;
}

const MessageChat = ({
  data,
  before,
  after,
  myUserID,
  onDeleteClick,
  onRejectClick,
  onReadClick,
  onConfirmClick,
  actionLoading,
  setReply,
  getReply,
  hasDelete,
  hasReply,
  hasUpdate,
  hasConfirm,
  hasReject,
  hasRead
}: props) => {
  const {t} = useTranslation('message');
  const user = useUser();
  const UserId: number = myUserID || user.getId();
  const {Text, Title} = Typography;

  const isMyMessage = UserId === (data?.user?.id || data?.from?.id || data?.from_id);
  const isLastMessage = after?.from?.id !== data?.from?.id || after?.from_id !== data?.from_id;
  const isFirstMessage = before?.from?.id !== data?.from?.id || before?.from_id !== data?.from_id;

  console.log(data, data?.from?.id, UserId, user.getId());

  const deleteMessage = () => {
    if (onDeleteClick) onDeleteClick(data?.id);
  };

  const showDeleteModal = () => {
    Modal.error({
      title: t('delete'),
      content: t('messages.delete_message'),
      okType: 'danger',
      okText: t('delete'),
      className: 'delete',
      cancelText: t('cancel'),
      okCancel: true,
      onOk: deleteMessage
    });
  };

  if (data.type !== 'question')
    return (
      <>
        {!data?.ticket_id ? (
          (!before ||
            convertUtcTimeToLocal(before?.created_at, 'jYYYY/jMM/jDD') !==
              convertUtcTimeToLocal(data?.created_at, 'jYYYY/jMM/jDD')) && (
            <Divider plain style={{borderTop: 2, borderTopColor: '#9e9e9e'}}>
              <Text className="text-xs" type="secondary">
                {convertUtcTimeToLocal(data?.created_at, 'jYYYY/jMM/jDD')}
              </Text>
            </Divider>
          )
        ) : (
          <Divider
            plain
            style={{borderTop: 2, borderTopColor: '#9e9e9e'}}
            className={`${before?.ticket_id === data?.ticket_id ? 'd-none' : ''}`}>
            <Text code>{data?.ticket_id}</Text>
          </Divider>
        )}
        <Scroll.Element
          name={toString(data?.id)}
          className={`message flex-col ${isMyMessage ? 'my-message' : ''} ${isLastMessage ? 'droplet' : ''} ${
            !before ? 'mt-1' : ''
          }`}>
          {isFirstMessage && (
            <Text type="secondary" className="pt-2 mr-3 text-xs text-right w-full">
              {data?.from?.full_name || data?.from?.username}
            </Text>
          )}
          <Space direction="vertical" size="small" className="w-full mb-10-p">
            {data?.reply && (
              <Button
                className="message__reply"
                onClick={() => {
                  if (data?.reply && getReply) getReply(data?.reply);
                }}>
                <Text type="secondary" className="text-xs text-right w-full">
                  {data?.reply?.user?.full_name || data?.reply?.user?.username}
                </Text>
                <Text type="secondary" className="text-xs text-right w-full">
                  {data?.reply?.content || t('empty')}
                </Text>
              </Button>
            )}
            {data?.type === 'image' && (
              <div className="message__image">
                <Image
                  alt="image"
                  fallback={chatImageDefault}
                  src={typeof data?.content === 'string' ? data?.content : URL.createObjectURL(data?.content)}
                />
              </div>
            )}
            {data?.type === 'sound' && (
              <div>
                <ConfigProvider direction="ltr">
                  <Col dir="ltr" className="voicePlayer">
                    {/*@ts-ignore*/}
                    <AudioPlayer
                      showSkipControls={false}
                      showJumpControls={false}
                      defaultCurrentTime=""
                      customAdditionalControls={[]}
                      src={typeof data?.content === 'string' ? data?.content : URL.createObjectURL(data?.content)}
                    />
                  </Col>
                </ConfigProvider>
              </div>
            )}
            {data?.type === 'video' && (
              <div className="message__text">
                <div className="message__text__content">
                  <video className="max-w-full max-h-400px rounded-xl" controls>
                    <source src={data?.content} type="video/mp4" />
                    Your browser does not support HTML video.
                  </video>
                </div>
              </div>
            )}
            {data?.type === 'prescription' && (
              <div className="message__text">
                <Space direction="horizontal">
                  <PrescriptionIcon />
                  <div className="message__text__content">
                    <Title level={5}>{t('electronic_prescription')}</Title>
                    <Text>{t('tracking_code', {code: data?.content?.electronic_prescription_visit?.head_id})}</Text>
                  </div>
                </Space>
              </div>
            )}
            {!includes(['image', 'video', 'sound', 'audio', 'prescription'], data?.type) && (
              <div className="message__text">
                <div className="message__text__content">
                  <Linkify options={{target: '_blank'}}>
                    <Text>{data?.content}</Text>
                  </Linkify>
                </div>
              </div>
            )}
            {!isEmpty(data?.mentions) && (
              <Avatar.Group maxCount={6} className="px-1">
                {map(data?.mentions, (user: userProps, index: number) => (
                  <Tooltip title={user?.full_name || user?.username} placement="top">
                    <Avatar src={user?.avatar} style={{backgroundColor: get(colors, index)}} icon={<UserOutlined />} />
                  </Tooltip>
                ))}
              </Avatar.Group>
            )}
            <MessageActions
              data={data}
              onRejectClick={onRejectClick}
              onConfirmClick={onConfirmClick}
              onReadClick={onReadClick}
              setReply={setReply}
              hasDelete={hasDelete}
              hasRead={hasRead}
              hasReply={hasReply}
              hasUpdate={hasUpdate}
              actionLoading={actionLoading}
              visibleDelete={showDeleteModal}
              hasReject={hasReject}
              hasConfirm={hasConfirm}
              isMyMessage={isMyMessage}
            />
          </Space>
          <div className="message__status">
            {isMyMessage && (data?.status === 'done' || data?.status === undefined) && (
              <CheckCircleOutlined style={{color: '#5dc452'}} />
            )}
            {data?.status === 'loading' && <ClockCircleOutlined style={{color: '#ff8222'}} />}
            {data?.status === 'error' && <CloseCircleOutlined style={{color: '#F44336'}} />}
            <Text className="m-r-1 text-xs" type="secondary">
              {convertUtcTimeToLocal(data?.created_at, data?.ticket_id ? 'HH:mm jYYYY/jM/jD' : 'HH:mm')}
            </Text>
          </div>
        </Scroll.Element>
        <Drop />
      </>
    );
  return null;
};

export default memo(MessageChat);
