import React, {memo} from 'react';
import {chatMessageProps, replyUpdateProps} from 'types/message';
import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {Col, ConfigProvider, Divider, Space, Typography, Image, Modal} from 'antd';
import {useTranslation} from 'react-i18next';
import {chatImageDefault, Drop, PrescriptionIcon} from 'assets';
import * as Scroll from 'react-scroll';
import AudioPlayer from 'react-h5-audio-player';
import {convertUtcTimeToLocal} from 'utils';
import {MessageActions} from 'components';
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

  console.log(UserId);

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

  return (
    <>
      {(!before ||
        convertUtcTimeToLocal(before?.creationTime, 'jYYYY/jMM/jDD') !==
          convertUtcTimeToLocal(data?.creationTime, 'jYYYY/jMM/jDD')) && (
        <Divider plain style={{borderTop: 2, borderTopColor: '#9e9e9e'}}>
          <Text className="text-xs" type="secondary">
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
