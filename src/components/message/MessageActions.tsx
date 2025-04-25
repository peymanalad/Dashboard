import React, {memo} from 'react';
import {IChatMessageProps, IReplyUpdateProps} from 'types/message';
import {
  EyeOutlined,
  LoadingOutlined,
  DeleteOutlined,
  RedoOutlined,
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import {Button, Space} from 'antd';
import {ReplyIcon} from 'assets';
import {normalizeMessage} from '../../utils';

export interface props {
  data: IChatMessageProps;
  setReply?: (parent: IReplyUpdateProps) => void;
  visibleDelete: (visible: boolean) => void;
  actionLoading?: boolean;
  onRejectClick: (id?: number) => void;
  onReadClick: (id?: number) => void;
  onConfirmClick: (id?: number) => void;
  hasReply?: boolean;
  hasUpdate?: boolean;
  hasDelete?: boolean;
  hasConfirm?: boolean;
  hasReject?: boolean;
  hasRead?: boolean;
  isMyMessage?: boolean;
}

const MessageActions = ({
  data,
  onRejectClick,
  onReadClick,
  onConfirmClick,
  actionLoading,
  visibleDelete,
  setReply,
  hasReply,
  hasUpdate,
  hasConfirm,
  hasDelete,
  hasReject,
  hasRead,
  isMyMessage
}: props) => {
  const replyClick = (e: any) => {
    e.stopPropagation();
    if (setReply)
      setReply({
        id: data?.sharedMessageId,
        user: {
          id: data?.side === 1 ? data?.userId : data?.targetUserId
        },
        ...normalizeMessage(data),
        isReply: true
      });
  };

  const updateClick = (e: any) => {
    e.stopPropagation();
    if (setReply)
      setReply({
        id: data?.sharedMessageId,
        user: {
          id: data?.side === 1 ? data?.userId : data?.targetUserId
        },
        type: data?.type || 'text',
        content: data?.message,
        isReply: false
      });
  };

  const confirmClick = (e: any) => {
    e.stopPropagation();
    onConfirmClick(data?.id);
  };

  const rejectClick = (e: any) => {
    e.stopPropagation();
    onRejectClick(data?.id);
  };

  const readClick = (e: any) => {
    e.stopPropagation();
    onReadClick(data?.id);
  };

  return (
    <div className="actions flex-row-reverse">
      {actionLoading ? (
        <LoadingOutlined className="mx-3" style={{color: '#26a69a', fontSize: 14}} />
      ) : (
        <Space size={-10}>
          {hasReject && (
            <Button type="text" icon={<CloseOutlined style={{color: 'red', fontSize: 12}} />} onClick={rejectClick} />
          )}
          {hasRead && (
            <Button type="text" icon={<EyeOutlined style={{color: '#f6830f', fontSize: 14}} />} onClick={readClick} />
          )}
          {hasConfirm && (
            <Button
              type="text"
              icon={<CheckOutlined style={{color: '#4CAF50', fontSize: 12}} />}
              onClick={confirmClick}
            />
          )}
          {hasReply && <Button type="text" icon={<ReplyIcon style={{fontSize: 14}} />} onClick={replyClick} />}
          {isMyMessage && hasUpdate && data?.type !== 'sound' && data?.type !== 'image' && (
            <Button
              type="text"
              className="text-orangeLight"
              icon={<EditOutlined style={{fontSize: 14}} />}
              onClick={updateClick}
            />
          )}
          {(data?.type === 'sound' || data?.type === 'audio') && (
            <a
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noreferrer"
              download="audio.mp3"
              href={typeof data?.content === 'string' ? data?.content : URL.createObjectURL(data?.content)}>
              <Button type="text" className="text-blue" icon={<DownloadOutlined style={{fontSize: 14}} />} />
            </a>
          )}
          {hasDelete && (
            <Button
              type="text"
              icon={<DeleteOutlined style={{color: 'red', fontSize: 14}} />}
              onClick={() => {
                visibleDelete(true);
              }}
            />
          )}
        </Space>
      )}
    </div>
  );
};

export default memo(MessageActions);
