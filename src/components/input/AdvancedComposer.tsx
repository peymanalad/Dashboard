import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  ForwardRefRenderFunction,
  ForwardedRef
} from 'react';
import {Badge, Button, Col, Input, Modal, Row, Space, Typography} from 'antd';
import {
  SendOutlined,
  CloseCircleOutlined,
  AudioOutlined,
  DeleteOutlined,
  SmileOutlined,
  FileProtectOutlined,
  UpOutlined
} from '@ant-design/icons';
import ScrollArea from 'react-scrollbar';
import {useTranslation} from 'react-i18next';
import {MultiSelect, MultiSelectPaginate, UploadFileChat} from 'components';
import {ReactMic} from 'react-mic';
import {RecordingIcon, RecordingStopIcon} from 'assets';
import {usePost, useUser} from 'hooks';
import {Picker} from 'emoji-mart';
import {chatType, replyUpdateProps} from 'types/message';
import {uploadAdvancedInputType} from 'types/file';
import {userProps} from 'types/user';
import {last, split, toString} from 'lodash';

interface refProps {
  getContent: () => string | File;
}

export interface props {
  onClick: (val: string | File, mentions?: userProps[]) => void;
  onSend: (id: string, type: chatType, file?: File) => void;
  onError: () => void;
  loading?: boolean;
  uploadType: uploadAdvancedInputType;
  reply?: replyUpdateProps;
  replyEmpty: () => void;
  disabled?: boolean;
  disableEmoji?: boolean;
  disableReadyMessage?: boolean;
  disableMentionUser?: boolean;
  disableVoice?: boolean;
}

const {Text} = Typography;

const AdvancedComposer: ForwardRefRenderFunction<refProps, props> = (
  {
    onClick,
    onError,
    loading,
    reply,
    replyEmpty,
    onSend,
    disabled,
    uploadType,
    disableEmoji,
    disableReadyMessage,
    disableMentionUser,
    disableVoice
  }: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('message');
  const user = useUser();
  const UserId: number = user.getId();

  const [message, setMessage] = useState<string | File>('');
  const [mentions, setMentions] = useState<userProps[]>([]);
  const [contentPos, setContentPos] = useState<number>(0);
  const [contentBefore, setContentBefore] = useState<string | File>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [recordShow, setRecordShow] = useState<boolean>(false);
  const [recordData, setRecordData] = useState<File | null>(null);
  const [configShow, setConfigShow] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [mentionUserShow, setMentionUserShow] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState<boolean>();

  useImperativeHandle(forwardedRef, () => ({
    getContent() {
      return contentBefore;
    }
  }));

  useEffect(() => {
    if (contentBefore) {
      onClick(contentBefore, mentions);
    }
  }, [contentBefore]);

  useEffect(() => {
    if (!reply?.isReply && reply?.content) setMessage(reply?.content);
    if (reply?.type === 'text') setRecordShow(false);
  }, [reply]);

  const sendVoice = usePost({
    url: 'files/upload',
    method: 'POST',
    isGeneral: true,
    isMultipart: true,
    onSuccess: (data) => {
      onSend(data?.path, 'sound');
    }
  });

  const blobToFile = (theBlob: Blob, fileName: string): File => {
    const newFile = new File([theBlob], `${fileName}.${last(split(theBlob.type, '/'))}`, {
      type: theBlob.type,
      lastModified: Date.now()
    });
    return newFile;
  };

  //create function to convert blob to file :

  const onStop = (recordedBlob: any) => {
    setRecordData(blobToFile(recordedBlob?.blob, 'newRecording'));
  };

  const sendVoiceToServer = () => {
    const formData = new FormData();
    formData.append('type', uploadType);
    formData.append('user_id', toString(UserId));
    recordData && formData.append('file', recordData);
    sendVoice.post(formData);
  };

  const OnclickContent = (e: any) => {
    setContentPos(e.target.selectionStart);
  };

  const ChangeContent = (e: any) => {
    setMessage(e.target.value);
    setContentPos(e.target.selectionStart);
  };

  const emojiSelect = (emoji: any) => {
    const des = message;
    const pos = contentPos;
    const addData = emoji?.native;
    setMessage(des?.slice(0, pos) + addData + des?.slice(pos));
  };

  return (
    <>
      <Modal
        visible={showEmoji}
        closable={false}
        width={300}
        className="not-body-modal"
        onCancel={() => {
          setShowEmoji(false);
        }}
        footer={null}>
        <Picker
          set="apple"
          enableFrequentEmojiSort
          showPreview={false}
          onSelect={emojiSelect}
          i18n={t('emojis', {returnObjects: true})}
        />
      </Modal>
      <div className="flex flex-col w-full relative bg-white">
        {reply && reply?.type === 'text' && (
          <Row className="reply">
            <Row className="content flex-1 flex-col">
              <Text>{reply?.user?.id !== UserId ? reply?.user?.full_name : t('you')}</Text>
              <Text type="secondary">{reply?.content}</Text>
            </Row>
            <Button
              type="text"
              icon={<CloseCircleOutlined style={{color: 'gray', fontSize: 16}} />}
              onClick={replyEmpty}
            />
          </Row>
        )}
        <Row className="flex flex-row w-full align-stretch flex-1">
          {recordShow || configShow || mentionUserShow ? (
            <>
              {recordShow && (
                <ReactMic
                  record={recording}
                  className="flex-1 input_chat"
                  visualSetting="sinewave"
                  mimeType="audio/wav"
                  onStop={onStop}
                  channelCount={2}
                  strokeColor="#1EC5C9"
                  backgroundColor="#383653"
                />
              )}
              {configShow && (
                <MultiSelect
                  url="configs/fetch"
                  keyLabel="name"
                  keyValue="message"
                  query={{language: 'fa', key: 'support_default_messages'}}
                  className="flex-1 input_chat"
                  placeholder={t('default_support_messages')}
                  urlName="defaultSupportMessages"
                  onChange={(data) => {
                    setMessage(data?.message);
                    setConfigShow(false);
                  }}
                  isGeneral
                  alignDropDownTop
                />
              )}
              {mentionUserShow && (
                <MultiSelectPaginate
                  url="users/mentions/paginate"
                  keyLabel="full_name"
                  keyValue="id"
                  mode="multiple"
                  className="flex-1 input_chat"
                  placeholder={t('search_users')}
                  urlName="usersMentions"
                  showSubTitle
                  onDropdownVisibleChange={setMentionUserShow}
                  keySubTitle={['role', 'title']}
                  value={mentions}
                  onChange={setMentions}
                  showSearch
                  alignDropDownTop
                />
              )}
            </>
          ) : (
            //@ts-ignore
            <ScrollArea horizontal={false} className="flex-1 max-h-100px" contentClassName="mr-5" speed={1}>
              <Input.TextArea
                autoSize
                disabled={disabled}
                value={typeof message === 'string' ? message : ''}
                onClick={OnclickContent}
                onChange={ChangeContent}
                className="message_input"
              />
            </ScrollArea>
          )}
          <Space direction="horizontal" size={2} className="d-none md:d-flex px-1 pt-1">
            {!disableVoice && (
              <>
                {recordShow ? (
                  recording ? (
                    <Button
                      onClick={() => {
                        setRecording(false);
                      }}
                      disabled={disabled}
                      className="mx-4"
                      type="text"
                      icon={<RecordingStopIcon style={{fontSize: 18}} />}
                    />
                  ) : recordData ? (
                    <Button
                      onClick={() => {
                        setRecordData(null);
                        setRecordShow(false);
                      }}
                      className="mx-4"
                      disabled={disabled}
                      type="text"
                      icon={<DeleteOutlined style={{color: 'red', fontSize: 18}} />}
                    />
                  ) : (
                    <Button
                      onClick={() => {
                        setRecording(true);
                      }}
                      className="mx-4"
                      disabled={disabled}
                      type="text"
                      icon={<RecordingIcon style={{fontSize: 18}} />}
                    />
                  )
                ) : (
                  <Button
                    onClick={() => {
                      setRecordShow(true);
                    }}
                    className="mx-4"
                    disabled={(reply && reply?.type === 'text') || disabled}
                    type="text"
                    icon={<AudioOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: 18}} />}
                  />
                )}
              </>
            )}
            {!recordShow && (
              <>
                {!disableEmoji && (
                  <Button
                    onClick={() => {
                      setShowEmoji(true);
                    }}
                    className="d-none md:d-block mx-4"
                    disabled={disabled}
                    type="text"
                    icon={<SmileOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: 18}} />}
                  />
                )}
                {!disableReadyMessage && (
                  <Button
                    onClick={() => {
                      setConfigShow((prevState: boolean) => !prevState);
                    }}
                    type="text"
                    className="mx-4"
                    disabled={disabled}
                    icon={
                      <FileProtectOutlined style={{color: configShow ? '#4CAF50' : 'rgba(0,0,0,.45)', fontSize: 18}} />
                    }
                  />
                )}
                {!disableMentionUser && (
                  <Badge count={mentions?.length} offset={[5, 0]}>
                    <Button
                      onClick={() => {
                        setMentionUserShow((prevState: boolean) => !prevState);
                      }}
                      type="text"
                      disabled={disabled}
                      className="font-bold p-0 pb-1 mx-4"
                      style={{color: mentionUserShow ? '#26a69a' : 'rgba(0,0,0,.45)', fontSize: 17, width: '32px'}}>
                      @
                    </Button>
                  </Badge>
                )}
                <UploadFileChat
                  className="mx-4"
                  disabled={(reply && reply?.type === 'text') || disabled}
                  sendFile={(file) => setContentBefore(file)}
                  ErrorFile={onError}
                  uploadType={uploadType}
                  sendPath={(id, type, file) => {
                    onSend(id, type, file);
                  }}
                />
              </>
            )}
          </Space>
          <Button
            className="h-full ml-3 d-block md:d-none"
            type="text"
            icon={
              <UpOutlined
                className="d-block md:d-none text-gray "
                style={{
                  fontSize: 18,
                  transform: showActions ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'all .3s ease'
                }}
              />
            }
            onClick={() => setShowActions(!showActions)}
          />
          <div className="justify-center bg-lightGray m-1 message_button">
            <Button
              disabled={
                loading || disabled || !recordShow
                  ? !(typeof message === 'string' && message?.replace(/\r?\n|\r/g, '').length)
                  : !(!recording && recordData)
              }
              loading={loading}
              onClick={() => {
                if (recordShow && !recording && recordData) {
                  setContentBefore(recordData);
                  sendVoiceToServer();
                } else if (typeof message === 'string') {
                  setContentBefore(message);
                  onSend(message, 'text');
                  setMessage('');
                }
              }}
              type="text"
              className="text-center w-full h-full"
              icon={<SendOutlined className="text-gray text-lg text-grayDarker rotate-180" />}
            />
          </div>
        </Row>
        <div className={`chat-actions-wrapper md:d-none ${showActions ? 'show' : ''}`}>
          <Row className="chat-actions-container">
            {recordShow ? (
              recording ? (
                <Col span={12} className="flex flex-col items-center">
                  <Button
                    onClick={() => {
                      setRecording(false);
                    }}
                    disabled={disabled}
                    type="text"
                    icon={<RecordingStopIcon style={{fontSize: 18}} />}
                  />
                </Col>
              ) : recordData ? (
                <Col span={12} className="flex flex-col items-center">
                  <Button
                    onClick={() => {
                      setRecordData(null);
                      setRecordShow(false);
                    }}
                    className=""
                    disabled={disabled}
                    type="text"
                    icon={<DeleteOutlined style={{color: 'red', fontSize: 18}} />}
                  />
                </Col>
              ) : (
                <Col span={12} className="flex flex-col items-center">
                  <Button
                    onClick={() => {
                      setRecording(true);
                    }}
                    className=""
                    disabled={disabled}
                    type="text"
                    icon={<RecordingIcon style={{fontSize: 18}} />}
                  />
                </Col>
              )
            ) : (
              <Col span={12} className="flex flex-col items-center">
                <Button
                  onClick={() => {
                    setRecordShow(true);
                    setConfigShow(false);
                    setMentionUserShow(false);
                    setShowEmoji(false);
                  }}
                  className=""
                  disabled={(reply && reply?.type === 'text') || disabled}
                  type="text"
                  icon={<AudioOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: 18}} />}
                />
                <small>{t('sendVoice')}</small>
              </Col>
            )}
            {!recordShow && (
              <>
                {!disableEmoji && (
                  <Col span={12} className="flex flex-col items-center">
                    <Button
                      onClick={() => {
                        setShowEmoji(true);
                        setRecordShow(false);
                        setConfigShow(false);
                        setMentionUserShow(false);
                      }}
                      className=""
                      disabled={disabled}
                      type="text"
                      icon={<SmileOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: 18}} />}
                    />
                    <small>{t('emoji')}</small>
                  </Col>
                )}
                {!disableReadyMessage && (
                  <Col span={12} className="flex flex-col items-center">
                    <Button
                      onClick={() => {
                        setConfigShow((prevState: boolean) => !prevState);
                        setShowEmoji(false);
                        setRecordShow(false);
                        setMentionUserShow(false);
                      }}
                      type="text"
                      className=""
                      disabled={disabled}
                      icon={
                        <FileProtectOutlined
                          style={{color: configShow ? '#4CAF50' : 'rgba(0,0,0,.45)', fontSize: 18}}
                        />
                      }
                    />
                    <small>{t('defaultMessages')}</small>
                  </Col>
                )}
                {!disableMentionUser && (
                  <Col span={12} className="flex flex-col items-center">
                    <Badge count={mentions?.length} offset={[5, 0]}>
                      <Button
                        onClick={() => {
                          setMentionUserShow((prevState: boolean) => !prevState);
                          setConfigShow(false);
                          setShowEmoji(false);
                          setRecordShow(false);
                        }}
                        type="text"
                        disabled={disabled}
                        className="font-bold p-0 pb-1 "
                        style={{color: mentionUserShow ? '#26a69a' : 'rgba(0,0,0,.45)', fontSize: 17, width: '32px'}}>
                        @
                      </Button>
                    </Badge>
                    <small>{t('mentionUser')}</small>
                  </Col>
                )}
                <Col span={12} className="flex flex-col items-center">
                  <UploadFileChat
                    className=""
                    disabled={(reply && reply?.type === 'text') || disabled}
                    sendFile={(file) => setContentBefore(file)}
                    uploadType={uploadType}
                    ErrorFile={onError}
                    sendPath={(path, type, file) => {
                      onSend(path, type === 'audio' ? 'sound' : type, file);
                    }}
                  />
                  <small>{t('sendFile')}</small>
                </Col>
              </>
            )}
          </Row>
        </div>
      </div>
    </>
  );
};

export default forwardRef(AdvancedComposer);
