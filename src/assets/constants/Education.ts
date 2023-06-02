import {i18n} from 'libs';

export const levelSurface = [
  {id: 0, name: '0'},
  {id: 1, name: '1'},
  {id: 2, name: '2'},
  {id: 3, name: '3'}
];
export const genders = [
  {id: 0, name: 'all'},
  {id: 1, name: 'female'},
  {id: 2, name: 'male'}
];
export const genderType = [
  {id: 1, name: 'female'},
  {id: 2, name: 'male'}
];
export const season = [
  {id: 0, name: 'all'},
  {id: 1, name: 'spring'},
  {id: 2, name: 'summer'},
  {id: 3, name: 'autumn'},
  {id: 4, name: 'winter'}
];
export const seasonType = [
  {id: 1, name: 'spring'},
  {id: 2, name: 'summer'},
  {id: 3, name: 'autumn'},
  {id: 4, name: 'winter'}
];
export const maritalStatus = [{name: 'all'}, {name: 'single'}, {name: 'married'}];

export const maritalStatusType = [
  {id: 1, name: 'single'},
  {id: 2, name: 'married'}
];

export const recommendationStatus = [
  {name: 'new'},
  {name: 'check'},
  {name: 'confirm'},
  {name: 'edit'},
  {name: 'archive'}
];

export const doctorConfirmStatus = [
  {id: 'confirm', name: i18n.t('recommendation:confirmed')},
  {id: 'not_confirm', name: i18n.t('recommendation:not_confirmed')}
];

export const evidences = [{name: 'A'}, {name: 'B'}, {name: 'C'}, {name: 'D'}];

export const sourceType = [
  {id: 0, name: 'article'},
  {id: 1, name: 'site'},
  {id: 2, name: 'book'},
  {id: 3, name: 'brochure'}
];

export const typeRecommendationSources = [
  {id: 'recommendation', name: 'recommendation'},
  {id: 'warning', name: 'warning'}
];

export const is_confirm = [
  {id: 0, name: 'inactive'},
  {id: 1, name: 'active'}
];

export const is_confirm_care = [
  {id: '1', name: 'active.true'},
  {id: '0', name: 'active.false'}
];

export const is_parent = [
  {id: 0, name: 'child'},
  {id: 1, name: 'parent'}
];

export const type = [{name: 'common'}, {name: 'special'}];

export const studyType = [
  {id: 0, name: 'humanity'},
  {id: 1, name: 'in vivo'},
  {id: 2, name: 'in vitro'},
  {id: 3, name: 'meta analysis'},
  {id: 4, name: 'systematic review'},
  {id: 5, name: 'EBM guidline'},
  {id: 6, name: 'RCT'},
  {id: 7, name: 'COHORT'},
  {id: 8, name: 'case series and studies'},
  {id: 9, name: 'case reports'},
  {id: 10, name: 'animal'},
  {id: 11, name: 'non-EBM guidline'},
  {id: 12, name: 'expert opinion'},
  {id: 13, name: 'Narrative review'},
  {id: 14, name: 'case-control'},
  {id: 15, name: 'cross section'}
];

export const levelEvidence = [
  {
    id: '0',
    name_fa: 'متاانالیز',
    name_en: 'meta analysis',
    level: 'A'
  },
  {
    id: '1',
    name_fa: 'مرور سیستماتیک',
    name_en: 'systematic review',
    level: 'A'
  },
  {
    id: '2',
    name_fa: 'گایدلاین با مدرک',
    name_en: 'EBM guidline',
    level: 'A'
  },
  {
    id: '3',
    name_fa: 'کارازمایی بالینی',
    name_en: 'RCT',
    level: 'B'
  },
  {
    id: '4',
    name_fa: 'مطالعه کوهورت',
    name_en: 'COHORT',
    level: 'B'
  },
  {
    id: '5',
    name_fa: 'مطالعه موردی',
    name_en: 'case series and studies',
    level: 'C'
  },
  {
    id: '6',
    name_fa: 'گزارش موردی بیمار',
    name_en: 'case reports',
    level: 'C'
  },
  {
    id: '7',
    name_fa: 'گایدلاین بدون مدرک',
    name_en: 'non-EBM guidline',
    level: 'D'
  },
  {
    id: '8',
    name_fa: 'نظر متخصص',
    name_en: 'expert opinion',
    level: 'D'
  }
];

export const columnsEvidence = [
  {
    title: `${i18n.t('general:persian')}`,
    dataIndex: 'name_fa',
    key: 'name_fa'
  },
  {
    title: `${i18n.t('general:english')}`,
    dataIndex: 'name_en',
    key: 'name_en'
  },
  {
    title: `${i18n.t('general:level_evidence')}`,
    dataIndex: 'level',
    key: 'level'
  }
];

export const nutritionalStatus = [
  {name: i18n.t('nutritional:active'), id: 1},
  {name: i18n.t('nutritional:inactive'), id: 0}
];

export const nutritionalState = [{name: 'solid'}, {name: 'liquid'}, {name: 'gas'}];

export const nutritionalMeta = [
  {name: 'water'},
  {name: 'calorie'},
  {name: 'protein'},
  {name: 'carbohydr'},
  {name: 'crude_fibr'},
  {name: 'diet_fiber'},
  {name: 'fat_mono'},
  {name: 'fat_poly'},
  {name: 'fat_total'},
  {name: 'fat_satur'},
  {name: 'cholestrol'},
  {name: 'linoleic'},
  {name: 'oleic'},
  {name: 'vit_a'},
  {name: 'vit_b1'},
  {name: 'vit_b2'},
  {name: 'vit_b3'},
  {name: 'vit_b6'},
  {name: 'folacin'},
  {name: 'vit_b12'},
  {name: 'panto'},
  {name: 'vit_c'},
  {name: 'vit_d'},
  {name: 'vit_e'},
  {name: 'vit_e_tot'},
  {name: 'biotin'},
  {name: 'vit_k'},
  {name: 'lysin'},
  {name: 'leucin'},
  {name: 'trypto'},
  {name: 'threonin'},
  {name: 'isoleucin'},
  {name: 'methionin'},
  {name: 'phenyl_ala'},
  {name: 'histidin'},
  {name: 'tyrosin'},
  {name: 'cystin'},
  {name: 'valin'},
  {name: 'alcohol'},
  {name: 'ash'},
  {name: 'iron'},
  {name: 'iodin'},
  {name: 'copper'},
  {name: 'sodium'},
  {name: 'calcium'},
  {name: 'phosphor'},
  {name: 'chloride'},
  {name: 'fluoride'},
  {name: 'potassium'},
  {name: 'manganese'},
  {name: 'magnesium'},
  {name: 'chromium'},
  {name: 'selenium'},
  {name: 'molybden'},
  {name: 'zinc'},
  {name: 'sugar'}
];

export const RecommendationLog = [
  {name: 'limit_recommendation'},
  {name: 'exclude_disease'},
  {name: 'end_recommendation'},
  {name: 'not_confirmed'}
];

export const pictureStatus = [
  {id: '1', name: i18n.t('recommendation:pictureStatus:has')},
  {id: '0', name: i18n.t('recommendation:pictureStatus:hasNot')}
];
