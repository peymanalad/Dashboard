interface provider {
  name: string;
  id: number;
}

export interface searchOptionsProps {
  name?: string;
  provider_id?: number;
  provider?: provider;
  is_active?: 1 | 0;
}
