import React, {memo, useMemo} from 'react';
import {chatMessageProps, replyUpdateProps} from 'types/message';
import {
  FileZipOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined
} from '@ant-design/icons';
import {Col, ConfigProvider, Divider, Space, Typography, Image, Modal, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import {chatImageDefault, Drop, PrescriptionIcon} from 'assets';
import * as Scroll from 'react-scroll';
import AudioPlayer from 'react-h5-audio-player';
import {convertUtcTimeToLocal, getChatImageUrl} from 'utils';
import {MessageActions} from 'components';
import {useUser} from 'hooks';
import toString from 'lodash/toString';
import {includes} from 'lodash';
import Linkify from 'linkify-react';
import {normalizeMessage} from '../../utils/message';

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

  const isMyMessage = UserId === data?.userId;
  const isLastMessage = after?.userId !== data?.userId;

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

  const message = useMemo(() => normalizeMessage(data), [data?.message]);

  if (message?.type === 'upload') return null;

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
          {message?.type === 'prescription' && (
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
          {!includes(['image', 'video', 'sound', 'audio', 'link', 'file'], message?.type) && (
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
            {convertUtcTimeToLocal(data?.creationTime, 'HH:mm')}
          </Text>
        </div>
      </Scroll.Element>
      <Drop />
    </>
  );
};

export default memo(MessageChat);
