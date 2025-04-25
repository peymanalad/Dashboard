import i18n from 'libs/I18n';
import {UserTypeEnum} from 'types/user';

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-=`|"'"]).{8,}$/;

export const UserTypes = [
  {id: UserTypeEnum.Normal, name: i18n.t('user-show:normalUser')},
  {id: UserTypeEnum.Creator, name: i18n.t('user-show:creatorUser')},
  {id: UserTypeEnum.Monitor, name: i18n.t('user-show:monitorUser')},
  {id: UserTypeEnum.Distributer, name: i18n.t('user-show:distributerUser')},
  {id: UserTypeEnum.Admin, name: i18n.t('user-show:adminUser')},
  {id: UserTypeEnum.SuperAdmin, name: i18n.t('user-show:superAdminUser')}
];

export const UserStatues = [
  {id: 'true', name: i18n.t('user-show:statuses.active')},
  {id: 'false', name: i18n.t('user-show:statuses.inactive')}
];

export const PermissionStatus = [
  {name: i18n.t('permission:assign.pull'), id: 0},
  {name: i18n.t('permission:assign.push'), id: 1}
];

export const providingType = [
  {id: '1', name: i18n.t('user-show:provideService')},
  {id: '0', name: i18n.t('user-show:notProvideService')}
];
