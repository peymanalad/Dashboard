export type status = 'succeed' | 'pending' | 'failed';

export interface searchOptionsProps {
  created_at?: string;
  status?: status;
}
