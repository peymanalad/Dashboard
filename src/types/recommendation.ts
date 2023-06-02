import {ReferenceRecommendationOptionProps} from 'types/reference';
import {diseaseChildren} from 'types/common';

export interface searchOptionsProps {
  title?: string;
  id?: string;
  disease: diseaseChildren;
  disease_id?: number;
  content?: string;
  subject?: {title: string; id: number | string};
  subject_id?: number | string;
}

export interface searchLogOptionsProps {
  doctor_id?: number;
  disease_id?: number;
  type?: 'limit_recommendation' | 'exclude_disease' | 'end_recommendation' | 'not_confirmed';
}

export interface BMIProps {
  min: string;
  max: string;
  message: string | null;
}

export interface RecommendationFileProps {
  path: string;
  path_url: string;
  type: 'image' | 'audio' | 'video';
}

export interface RecommendationSourceProps {
  key: number;
  title: string;
  link: string;
  reference?: ReferenceRecommendationOptionProps;
}

export interface user {
  id: number;
  full_name: string;
}

export interface replyProps {
  id: number;
  user: user;
  content: string;
}

export interface CommentProps {
  id: number;
  content: string;
  status?: 'loading' | 'done' | 'error';
  reply?: replyProps;
  user: user;
  permissions: {
    delete: boolean;
  };
}
