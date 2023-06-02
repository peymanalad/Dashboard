export interface permissionProps {
  id?: number;
  name?: string;
}

export interface permissionUserProps {
  permission?: permissionProps;
  can?: 0 | 1;
}

export interface permissionRoleProps {
  permission?: permissionProps;
  on_role?: permissionProps;
}

export interface searchOptionsProps {
  search?: string;
}
