import {i18n} from 'libs';

export const QuestionType = [
  {name: 'text'},
  {name: 'number'},
  {name: 'date'},
  {name: 'one_select'},
  {name: 'multi_select'},
  {name: 'one_select_custom'},
  {name: 'multi_select_custom'}
];

export const QuestionAbleTypeStatus = [{name: 'diseases'}, {name: 'medicines'}, {name: 'tags'}];

export const QuestionMaritalStatus = [{name: 'all'}, {name: 'single'}, {name: 'married'}];

export const QuestionSeason = [{name: 'all'}, {name: 'spring'}, {name: 'summer'}, {name: 'autumn'}, {name: 'winter'}];

export const QuestionPeriod = [{name: 'all'}];

export const QuestionGenders = [{name: 'all'}, {name: 'female'}, {name: 'male'}];

export const QuestionChartType = [
  {id: 'pie', name: i18n.t('question:pie')},
  {id: 'line', name: i18n.t('question:line')},
  {id: 'both', name: i18n.t('question:both')}
];
export const QuestionStatus = [
  {name: i18n.t('question:active'), id: '1'},
  {name: i18n.t('question:inactive'), id: '0'}
];

export const AnsweredType = [
  {id: '1', name: i18n.t('question:answered')},
  {id: '0', name: i18n.t('question:not_answered')}
];

export const AnswerDetailStatus = [
  {value: '1', name: i18n.t('question:reviewed')},
  {value: '0', name: i18n.t('question:not_reviewed')}
];
export const AnswerDetailType = [
  {value: 'strength_and_weakness', name: i18n.t('question:strength_weakness')},
  {value: 'important', name: i18n.t('question:important')}
];

export const FilterType = [
  {name: 'gender_all'},
  {name: 'female'},
  {name: 'male'},
  {name: 'season_all'},
  {name: 'spring'},
  {name: 'summer'},
  {name: 'autumn'},
  {name: 'winter'},
  {name: 'is_married_all'},
  {name: 'single'},
  {name: 'married'},
  {name: 'weight_min'},
  {name: 'weight_max'},
  {name: 'age_range_min'},
  {name: 'age_range_max'}
];
