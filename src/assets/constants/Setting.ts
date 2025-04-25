import i18n from 'libs/I18n';

export const typeSetting = [
  {name: 'int'},
  {name: 'bool'},
  {name: 'float'},
  {name: 'double'},
  {name: 'array'},
  {name: 'string'}
];

export const directions = [{name: 'ltr'}, {name: 'rtl'}];

export const OSType = [{name: 'ios'}, {name: 'android'}];

export const configHelp = [
  {
    title: i18n.t('setting:help:basic_info'),
    content: {
      title: i18n.t('setting:help:title'),
      name: i18n.t('setting:help:name'),
      size: i18n.t('setting:help:size'),
      type: i18n.t('setting:help:type'),
      options: {
        mode: i18n.t('setting:help:options:mode'),
        data: i18n.t('setting:help:options:data'),
        label: i18n.t('setting:help:options:label'),
        value: i18n.t('setting:help:options:value'),
        type: i18n.t('setting:help:options:type')
      }
    }
  },
  {
    title: i18n.t('setting:help:one_element_example'),
    content: {
      title: 'nickname',
      name: 'name',
      size: 0.33,
      type: 'number'
    }
  },
  {
    title: i18n.t('setting:help:object_element_example'),
    content: {
      name: 'names',
      type: 'object',
      elements: [
        {
          name: 'name1',
          title: 'title1',
          type: 'string',
          size: 0.33
        },
        {
          name: 'name2',
          title: 'title2',
          type: 'number',
          size: 0.66
        }
      ]
    }
  },
  {
    title: i18n.t('setting:help:array_element_example'),
    content: {
      name: 'names',
      title: 'names',
      type: 'array',
      elements: [
        {
          name: 'name1',
          title: 'title1',
          type: 'file',
          options: {
            mode: 'single',
            type: 'image'
          },
          size: 0.33
        },
        {
          name: 'name2',
          title: 'title2',
          type: 'select',
          options: {
            mode: 'multiple',
            label: 'name',
            value: 'id',
            data: [
              {name: 'nameOne', id: 'idOne'},
              {name: 'nameTwo', id: 'idTwo'}
            ]
          },
          size: 0.66
        }
      ]
    }
  }
];
