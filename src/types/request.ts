export type metaProps = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type ResponseProps = {
  data: any;
  error: string | null;
  success: boolean;
};

export interface MutationRequestProps {
  body?: any;
  queryParams?: object;
  params?: object;
  token?: string;
}
