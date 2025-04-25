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

export interface PermissionProps {
  description: string | null;
  displayName: string;
  isGrantedByDefault: boolean;
  level: number;
  name: string;
  parentName: string | null;
}
