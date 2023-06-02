import {itemDrillDownMenu} from 'components/select/DrillDownSelectPaginate';

export interface diseaseProps {
  disease: itemDrillDownMenu;
  is_active?: number;
  type?: number;
  subject?: {id: string | number; title: string | undefined};
  permissions?: permissions;
}

export interface editDiseaseProps {
  disease_id?: string | number;
  subject_id?: string | number;
  is_active?: number;
  type?: number;
}

export interface searchOptionsProps {
  clinic?: {name: string; id: number};
  disease_id?: Array<string | number>;
  disease: any;
  clinic_id?: number;
  doctor?: {full_name: string; id: number};
  doctor_id?: number;
  created_at?: string;
  user_id?: string;
  id?: string;
  status?: string;
}

interface childrenProps {
  id: number;
  title: string;
  questions?: Array<{id: number | string; title: string}>;
  children?: Array<childrenProps>;
}
export interface questionVisitProps {
  id: number;
  title: string;
  questions?: Array<{id: number; title: string}>;
  children?: Array<childrenProps>;
}
export interface questionOptionsProps {
  id: number;
  title: string;
  value: string;
  options: optionsProps;
}
export interface optionsProps {
  id: string;
  name: string;
  value: string;
  uniqKey: string;
}

export interface visitsImage {
  id: number;
  path: string;
  picture_url: string;
  permissions: permissions;
}

export interface permissions {
  update?: boolean;
  delete?: boolean;
}
