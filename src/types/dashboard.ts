import {ReactNode} from 'react';
import type {ResponsiveScreenProps, ChartType} from 'types/general';
import type {UserTypeEnum} from 'types/user';

export interface extraDashboardRouteProps {
  title: string;
  route: string;
  permission: string;
  hidden?: boolean;
}

export interface subDashboardRouteProps extends dashboardRouteProps {
  extra?: extraDashboardRouteProps;
  hidden?: boolean;
}

export interface dashboardRouteProps {
  title?: string;
  icon?: ReactNode;
  key?: string;
  route?: string;
  hidden?: boolean;
  forSuperAdmin?: boolean;
  allowUserType?: UserTypeEnum;
  permission?: string;
  cmp?: ReactNode;
  subs?: Array<subDashboardRouteProps>;
}

export type DashboardContentType = 'count' | 'count-outline' | 'chart' | 'list';

export interface DashboardMenubarSchema {
  name: string;
  icon: string;
  visible: boolean;
  title: string;
  link: string;
}

export interface DashboardConfigSchema {
  type?: ChartType;
  label?: string;
  value?: string;
}

export interface DashboardContentSchema {
  name: string;
  title: string;
  icon: string;
  link: string;
  size: ResponsiveScreenProps;
  color: string;
  configs?: DashboardConfigSchema;
  type: DashboardContentType;
}

export interface DashboardSchema {
  menubar: DashboardMenubarSchema[];
  content: DashboardContentSchema[];
}

export type DashboardCountInfo = {
  count: number;
  dateOfCount: string;
};

export type DashboardOrganizationData = {
  organizationId: number;
  organizationName: string;
  countInfo: DashboardCountInfo[];
};

export type DashboardTransformedValues = {
  [key: string]: number | string;
  dateOfCount: string;
};

export type DashboardTransformedData = {
  labels: Array<string>;
  values: Array<DashboardTransformedValues>;
};

export type DashboardPercentData = {
  name: string;
  percent: string;
};
