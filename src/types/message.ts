import {userProps} from 'types/user';

export interface user {
  full_name?: string;
  username?: string;
  id?: number;
}

export interface recommendationType {
  title?: string;
  id?: number;
}

export enum confirm {
  notConfirm,
  confirm
}

interface permissions {
  view?: boolean;
  update?: boolean;
  delete?: boolean;
  response?: boolean;
  open?: boolean;
  close?: boolean;
  confirm?: boolean;
  reject?: boolean;
  parent?: boolean;
  read?: boolean;
}

export interface chatItemProps {
  id: number;
  user: user;
  count: number;
  updated_at: string;
  permissions: permissions;
}

export type chatStatus = 'loading' | 'done' | 'error';
export type chatType = 'sound' | 'text' | 'image' | 'video' | 'prescription' | 'question' | 'audio';
export type commentType = 'support_to_patient' | 'support_to_doctor' | 'research_to_research';

export interface chatMessageProps {
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
  status?: chatStatus;
  type: chatType;
}

export interface commentMessageProps {
  content: string;
  created_at: any;
  from?: user;
  to?: user | null;
  from_id?: number;
  to_id?: number;
  id: string;
  is_confirm?: confirm;
  parent?: boolean;
  permissions?: permissions;
  read_at: string;
  status?: chatStatus;
  recommendation_id: recommendationType;
  reply?: replyUpdateCommentProps;
  type: commentType;
  user: user;
}

export interface replyUpdateProps {
  id: number | string;
  user?: user;
  type?: chatType;
  content?: any | File;
  isReply?: boolean;
}

export interface replyUpdateCommentProps {
  id: string;
  user?: user;
  type: commentType;
  content: string | File;
  isReply: boolean;
}

export interface reply {
  id: string;
  user?: user;
  type: chatType;
  content: string | File;
}

export interface defaultMessageOptionProps {
  id: number;
  name: string;
  value: string;
}

export enum ticketStatus {
  PatientPending = 1,
  DoctorPending,
  Inactive
}

export interface updateMessageProps {
  content?: string | File;
  status?: chatStatus;
  permissions?: permissions;
}
