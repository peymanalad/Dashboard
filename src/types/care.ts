export interface searchOptionsProps {
  id?: number;
  name?: string;
  synonym_name?: string;
  type?: 'special' | 'common' | null;
  icd?: string;
  is_confirm?: 1 | 0 | null;
  parent_id?: number;
}

export interface recommendationValue {
  name: string;
  count: number;
}

export interface SubjectRecommendationProps {
  name: string;
  values: recommendationValue[];
}
