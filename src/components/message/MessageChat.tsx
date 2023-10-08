import React, {memo, useMemo} from 'react';
import {
  FileZipOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined
} from '@ant-design/icons';
import {Col, ConfigProvider, Divider, Space, Typography, Image, Modal, Button, Card} from 'antd';
import {useTranslation} from 'react-i18next';
import {chatImageDefault, Drop, PrescriptionIcon} from 'assets';
import * as Scroll from 'react-scroll';
import AudioPlayer from 'react-h5-audio-player';
import {convertUtcTimeToLocal, getChatImageUrl, getImageUrl, normalizeMessage} from 'utils';
import {MessageActions, ShowLocation} from 'components';
import {useUser} from 'hooks';
import toString from 'lodash/toString';
import includes from 'lodash/includes';
import Linkify from 'linkify-react';
import type {chatMessageProps, replyUpdateProps} from 'types/message';
import {Link} from 'react-router-dom';

export interface props {
  data: chatMessageProps;
  before?: chatMessageProps;
  after?: chatMessageProps;
  myUserID?: number;
  setReply?: (parent: replyUpdateProps) => void;
  getReply?: (parent: replyUpdateProps) => void;
  actionLoading?: boolean;
  onDeleteClick: (sharedMessageId: string) => void;
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

const {Meta} = Card;

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
  hasDelete,
  hasReply,
  hasUpdate,
  hasConfirm,
  hasReject,
  hasRead
}: props) => {
  const {t} = useTranslation('message');
  const user = useUser();
  const {Text, Title} = Typography;

  const isMyMessage = data?.side === 1;
  const isLastMessage = after?.userId !== data?.userId;

  const deleteMessage = () => {
    if (onDeleteClick) onDeleteClick(data?.sharedMessageId);
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

  const message = useMemo(() => normalizeMessage(data), [data?.message]);

  if (message?.type === 'upload') return null;

  const isText = !includes(['image', 'video', 'sound', 'audio', 'link', 'file', 'location', 'post'], message?.type);

  return (
    <>
      {(!before ||
        convertUtcTimeToLocal(before?.creationTime, 'jYYYY/jMM/jDD') !==
          convertUtcTimeToLocal(data?.creationTime, 'jYYYY/jMM/jDD')) && (
        <Divider plain style={{borderTop: 2, borderTopColor: '#9e9e9e'}}>
          <Text className="text-xs text-no-wrap" type="secondary">
            {convertUtcTimeToLocal(data?.creationTime, 'jYYYY/jMM/jDD')}
          </Text>
        </Divider>
      )}
      <Scroll.Element
        name={toString(data?.id)}
        className={`message flex-col ${isMyMessage ? 'my-message' : ''} ${isLastMessage ? 'droplet' : ''} ${
          !before ? 'mt-1' : ''
        }`}>
        <Space direction="vertical" size="small" className="w-full mb-10-p">
          {message?.type === 'file' && (
            <div className="message__text">
              <div className="message__text__content">
                <Button
                  className="w-full"
                  type="dashed"
                  icon={<FileZipOutlined />}
                  onClick={() => window.open(getChatImageUrl(message?.content, user?.encrypted_access_token!))}>
                  {t('download-file')}
                </Button>
              </div>
            </div>
          )}
          {message?.type === 'image' && (
            <div className="message__image">
              <Image
                alt="image"
                fallback={chatImageDefault}
                src={
                  !data?.status
                    ? getChatImageUrl(message?.content, user?.encrypted_access_token!)
                    : URL.createObjectURL(message?.content)
                }
              />
            </div>
          )}
          {message?.type === 'sound' && (
            <div>
              <ConfigProvider direction="ltr">
                <Col dir="ltr" className="voicePlayer">
                  {/*@ts-ignore*/}
                  <AudioPlayer
                    showSkipControls={false}
                    showJumpControls={false}
                    defaultCurrentTime=""
                    customAdditionalControls={[]}
                    src={
                      !data?.status
                        ? getChatImageUrl(message?.content, user?.encrypted_access_token!)
                        : URL.createObjectURL(data?.content)
                    }
                  />
                </Col>
              </ConfigProvider>
            </div>
          )}
          {message?.type === 'link' && (
            <div className="message__text">
              <div className="message__text__content">
                <Button
                  className="w-full"
                  type="primary"
                  icon={<LinkOutlined />}
                  onClick={() => window.open(message?.content?.message)}>
                  {t('goto-link')}
                </Button>
              </div>
            </div>
          )}
          {message?.type === 'video' && (
            <div className="message__text">
              <div className="message__text__content">
                <video className="max-w-full max-h-400px rounded-xl" controls>
                  <source
                    src={
                      !data?.status
                        ? getChatImageUrl(message?.content, user?.encrypted_access_token!)
                        : URL.createObjectURL(message?.content)
                    }
                    type="video/mp4"
                  />
                  Your browser does not support HTML video.
                </video>
              </div>
            </div>
          )}
          {message?.type === 'location' && (
            <div className="message__text">
              <div className="message__text__content">
                <ShowLocation longitude={message?.content?.userLong} latitude={message?.content?.userLat} />
              </div>
            </div>
          )}
          {message?.type === 'post' && (
            <div className="message__text">
              <div className="message__text__content">
                <Card
                  hoverable
                  bordered
                  actions={[
                    <Link to={`/news/news/edit/${message?.content?.id}`}>
                      <LinkOutlined key="link" />
                    </Link>
                  ]}
                  cover={<img alt="example" src={getImageUrl(message?.content?.postFiles?.[0])} />}>
                  <Meta title={message?.content?.postTitle} description={message?.content?.postCaption} />
                </Card>
              </div>
            </div>
          )}
          {isText && (
            <div className="message__text">
              <div className="message__text__content">
                <Linkify options={{target: '_blank'}}>
                  <Text>{data?.message}</Text>
                </Linkify>
              </div>
            </div>
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
            hasUpdate={isText && hasUpdate}
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
            {convertUtcTimeToLocal(data?.creationTime, 'HH:mm')}
          </Text>
        </div>
      </Scroll.Element>
      <Drop />
    </>
  );
};

export default memo(MessageChat);
