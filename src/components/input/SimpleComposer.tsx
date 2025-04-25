import React, {useState, memo} from 'react';
import {Button, Input, Row, Typography} from 'antd';
import {SendOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {IReplyUpdateProps} from 'types/message';
import {useTranslation} from 'react-i18next';
import ScrollArea from 'react-scrollbar';
import {useUser} from 'hooks';

export interface props {
  onSend: (val: string) => void;
  loading?: boolean;
  reply?: IReplyUpdateProps;
  replyEmpty?: () => void;
}

const {Text} = Typography;

const SimpleComposer = ({onSend, loading, reply, replyEmpty}: props) => {
  const {t} = useTranslation('message');
  const [message, setMessage] = useState('');
  const user = useUser();

  return (
    <Row className="flex flex-col w-full support-chat-input">
      {reply && (
        <Row className="reply">
          <Row className="content flex-1 flex-col">
            <Text>{reply.user?.id !== user.getId() ? reply.user?.full_name || reply?.user?.username : t('you')}</Text>
            <Text>{reply.content}</Text>
          </Row>
          <Button
            type="text"
            icon={<CloseCircleOutlined style={{color: 'gray', fontSize: 16}} />}
            onClick={replyEmpty}
          />
        </Row>
      )}
      <Row className="flex flex-row w-full align-stretch flex-1">
        {/*@ts-ignore*/}
        <ScrollArea horizontal={false} className="flex-1 max-h-100px" contentClassName="mr-5 " speed={1}>
          <Input.TextArea
            autoSize
            value={message}
            onChange={(val) => {
              setMessage(val.target.value);
            }}
            className="message_input"
          />
        </ScrollArea>
        <Row className="justify-center bg-lightGray m-1 message_button">
          <Button
            disabled={!message?.replace(/\r?\n|\r/g, '').length}
            loading={loading}
            onClick={() => {
              onSend(message);
              setMessage('');
            }}
            type="text"
            className="text-center w-full h-full"
            icon={<SendOutlined className="text-gray text-lg text-grayDarker rotate-180" />}
          />
        </Row>
      </Row>
    </Row>
  );
};

export default memo(SimpleComposer);
