import {Role} from 'types/common';

export enum UserTypeEnum {
  Normal = 0,
  Creator = 1,
  Monitor = 2,
  Distributer = 3,
  Admin = 4,
  SuperAdmin = 5
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
