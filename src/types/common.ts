export interface simplePermissionProps {
  update: boolean;
  delete: boolean;
}

export interface Role {
  id?: number;
  name?: string;
  title?: string;
}

export interface ITableProps {
  name: string;
  columns: object[];
  data: object[];
}

export interface IDynamicParams {
  query?: object;
  params?: object;
  search?: object;
}
