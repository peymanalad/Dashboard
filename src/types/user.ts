import {Role} from 'types/common';
import {diseaseProps} from './visit';

export enum UserTypeEnum {
  Normal = 0,
  Creator = 1,
  Monitor = 2,
  Distributer = 3,
  Admin = 4,
  SuperAdmin = 5
}

export interface UserProfile {
  name: string;
  roles: Array<number>;
}

export interface userAccessProps {
  is_logged_in: boolean;
  access_token?: string;
  encrypted_access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  full_name?: string;
  id?: number;
  avatar?: string;
}

export interface userProps {
  id: number;
  name?: string | null;
  full_name?: string | null;
  username: string;
  avatar?: string;
  mobile?: string;
  role?: Role;
}

export interface UserActionPermissions {
  delete?: boolean;
  doctor_report?: boolean;
  'orders.store'?: boolean;
  'orders.view'?: boolean;
  'permissions.view'?: boolean;
  send_sms?: boolean;
  'support_messages.view'?: boolean;
  update?: boolean;
  view?: boolean;
  'visits.store'?: boolean;
  'visits.view'?: boolean;
}

export interface doctorProps extends userProps {
  specifications: any[];
}

export interface patientProps extends userProps {
  diseases: diseaseProps[];
}

export interface UserShowListProps {
  name: string | null;
  full_name?: string | null;
  username: string;
}

export interface searchOptionsProps {
  role_id?: string | number;
  clinics_id?: string;
  doctors_id?: string;
  created_at?: string;
  username?: string;
  id?: string;
}

export interface SpecializationSearchProps {
  search?: string;
  create_at?: string;
}

export interface Location {
  country?: {id: number; name: string};
  province?: {id: number; name: string};
  city?: {id: number; name: string};
}

export interface certificateImages {
  name: string;
  status: string;
  uid: number;
  path: string;
  url: string;
}

export interface financialService {
  price: number;
  percent: number;
  service: {id: number; name: string};
}

export interface TemporaryUser {
  code: string;
  created_at: string;
  id: number;
  permissions: {delete: boolean};
  tries: number;
  updated_at: string;
  username: string;
}
