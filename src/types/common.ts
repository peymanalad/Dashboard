export interface simplePermissionProps {
  update: boolean;
  delete: boolean;
}

export interface permissionAdvancedProps {
  update?: boolean;
  delete?: boolean;
  priority?: boolean;
}

export interface Role {
  id?: number;
  name?: string;
  title?: string;
}

export interface tableProps {
  name: string;
  columns: object[];
  data: object[];
}

export interface diseaseChildren {
  id: number;
  is_parent: 0 | 1;
  name: string;
  synonym_name: string;
}

export interface dynamicParams {
  query?: object;
  params?: object;
  search?: object;
}
