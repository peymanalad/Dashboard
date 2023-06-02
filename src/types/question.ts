import {itemDrillDownMenu} from 'components/select/DrillDownSelectPaginate';
import {diseaseChildren} from 'types/common';

export interface Question {
  id: number;
  title: string;
}

export interface QuestionOptions {
  name?: string;
  value?: string;
  id: number;
}

export interface alertQuestion {
  id?: number;
  title?: string;
  options?: QuestionOptions[];
  value?: number;
}

export interface searchGroupOptionsProps {
  title?: string;
  gap?: number;
}

export interface searchOptionsProps {
  title?: string;
  status?: 'active' | 'inactive';
  chart_type?: 'pie' | 'line' | 'both';
  diseases_id?: number[];
  group_id?: number;
  diseases?: diseaseChildren[];
  group?: {title: string; id: number};
}

export interface alertTypeProps {
  id: number;
  text: string;
}

export interface optionsTypeProps {
  id: number;
  name: string;
  value: number;
  alert?: string;
}

export interface answerTypeProps {
  user_id?: number;
  question_group_id?: number;
  question_id?: number[];
  doctor_id?: number;
  is_answered?: '1' | '0';
  answered_at?: string;
  created_from?: string;
  created_to?: string;
}

export interface filterTypeProps {
  gender?: string;
  marital_status?: string;
  season?: string;
  weight_range?: number;
  age_range?: number;
}

export interface careProps {
  diseases: itemDrillDownMenu[];
  gap: number;
  period: number;
  time: string;
  filters: filterTypeProps[];
}

export interface editCareProps {
  diseases_id: string | number;
  gap: number;
  period: number;
  time: string;
  filters: filterTypeProps[];
}
