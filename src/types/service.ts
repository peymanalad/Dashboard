import {simplePermissionProps} from 'types/common';

export interface serviceProps {
  id: string;
  is_active: 0 | 1;
  name: string;
  price: string;
  type: string;
  permissions: simplePermissionProps;
}

export interface searchCouponOptionsProps {
  title?: string;
  code?: string;
  is_active?: 1 | 0;
}

export interface searchCouponGroupOptionsProps {
  name?: string;
}
