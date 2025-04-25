export interface user {
  full_name?: string;
  username?: string;
  id?: number;
}

export enum confirm {
  notConfirm,
  confirm
}

export type ChatStatusType = 'loading' | 'done' | 'error';
export type ChatType = 'sound' | 'text' | 'image' | 'video' | 'prescription' | 'question' | 'audio';
export type CommentType = 'support_to_patient' | 'support_to_doctor' | 'research_to_research';

export interface IChatMessageProps {
  userId: number;
  tenantId: number;
  targetUserId: number;
  targetTenantId: number;
  side: number;
  readState: number;
  receiverReadState: number;
  message: string;
  creationTime: string;
  sharedMessageId: string;
  id: number;
  recommendation_id?: {id: number; title: string};
  content: any;
  status?: ChatStatusType;
  type: ChatType;
}

export interface IReplyUpdateProps {
  id: number | string;
  user?: user;
  type?: ChatType;
  content?: any | File;
  isReply?: boolean;
}

export interface IReplyUpdateCommentProps {
  id: string;
  user?: user;
  type: CommentType;
  content: string | File;
  isReply: boolean;
}

export interface IReply {
  id: string;
  user?: user;
  type: ChatType;
  content: string | File;
}
