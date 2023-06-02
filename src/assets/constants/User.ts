import {i18n} from 'libs';

export const Complexities = [
  {id: 'all', name: 'همه'},
  {id: '0', name: '0'},
  {id: '1', name: '1'},
  {id: '2', name: '2'},
  {id: '3', name: '3'}
];

export const UserStatues = [
  {id: 'new', name: i18n.t('user-show:statuses.new')},
  {id: 'login', name: i18n.t('user-show:statuses.login')},
  {id: 'profile', name: i18n.t('user-show:statuses.profile')},
  {id: 'service', name: i18n.t('user-show:statuses.service')},
  {id: 'prepare', name: i18n.t('user-show:statuses.prepare')},
  {id: 'loyal', name: i18n.t('user-show:statuses.loyal')},
  {id: 'active', name: i18n.t('user-show:statuses.active')},
  {id: 'inactive', name: i18n.t('user-show:statuses.inactive')},
  {id: 'engaged', name: i18n.t('user-show:statuses.engaged')},
  {id: 'null', name: i18n.t('user-show:statuses.null')},
  {id: 'block', name: i18n.t('user-show:statuses.block')}
];

export const PermissionStatus = [
  {name: i18n.t('permission:assign.pull'), id: 0},
  {name: i18n.t('permission:assign.push'), id: 1}
];

export const providingType = [
  {id: '1', name: i18n.t('user-show:provideService')},
  {id: '0', name: i18n.t('user-show:notProvideService')}
];
