export type metaProps = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type responseProps = {
  data: any;
  meta: metaProps;
  schema: any;
  status: number;
  statusText: string;
};

export interface mutationRequestProps {
  body?: any;
  queryParams?: object;
  params?: object;
  token?: string;
}
