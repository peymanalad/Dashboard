import React, {ReactNode} from 'react';
import {PropertyPath} from 'lodash';

export interface language {
  id: number;
  direction: 'ltr' | 'rtl' | undefined;
  name: string;
  name_fa?: string;
}

export type SelectModeProps = 'multiple' | 'single';

export type SelectTypeProps = 'multiple' | 'tags';

export type ChartType = 'line' | 'bar' | 'pie';

export type NotificationStatusType = 'default' | 'granted' | 'denied';

export type uploadType =
  | 'users'
  | 'messages'
  | 'visits'
  | 'banks'
  | 'recommendations'
  | 'diseases'
  | 'sources'
  | 'configs'
  | 'products';

export type uploadAdvancedInputType = 'messages' | 'visits' | 'recommendations';

export interface ResponsiveScreenProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

export interface DropDownMenuItemProps {
  onClick: () => void;
  name: string;
  icon?: ReactNode;
  danger?: boolean;
}

export interface sortItem {
  key: string;
  span: number;
  render?: (value: any) => string;
}

export interface SubscribeDataProps {
  key: string;
  path: string | string[];
}

export interface menuItem {
  onClick: () => void;
  name: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface updatePathList {
  objectPath?: PropertyPath;
  listPath?: PropertyPath;
}
