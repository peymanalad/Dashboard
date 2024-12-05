import React from 'react';
import {
  FileTextOutlined,
  MailOutlined,
  UserOutlined,
  MessageOutlined,
  SettingOutlined,
  HomeOutlined,
  SlidersOutlined,
  BellOutlined,
  BankOutlined
} from '@ant-design/icons';
import {i18n} from 'libs';
import includes from 'lodash/includes';
import map from 'lodash/map';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import {lazyWithRetry} from 'utils';
import {dashboardRouteProps} from 'types/dashboard';

const DashboardCmp = lazyWithRetry(() => import('pages/dashboard/Dashboard2'));

// organization
const EditOrganization = lazyWithRetry(() => import('pages/dashboard/organization/show/EditOrganization'));
const ShowOrganization = lazyWithRetry(() => import('pages/dashboard/organization/show/ShowOrganization'));
const OrganizationShowList = lazyWithRetry(() => import('pages/dashboard/organization/show/ShowList'));

const OrganizationsShowGraph = lazyWithRetry(() => import('pages/dashboard/organization/graph/ShowGraph'));
const OrganizationChartGraph = lazyWithRetry(() => import('pages/dashboard/organization/graph/ShowOrganizationGraph2'));

// user
const EditUser = lazyWithRetry(() => import('pages/dashboard/user/show/EditUser'));
const ShowUser = lazyWithRetry(() => import('pages/dashboard/user/show/ShowUser'));
const CreateUser = lazyWithRetry(() => import('pages/dashboard/user/show/CreateUser'));
const UserShowList = lazyWithRetry(() => import('pages/dashboard/user/show/ShowList'));
const UserShow = lazyWithRetry(() => import('pages/dashboard/user/show/ShowUser'));
const OrganizationUserShowList = lazyWithRetry(() => import('pages/dashboard/user/organization/ShowList'));
const EditPermissionUser = lazyWithRetry(() => import('pages/dashboard/user/show/EditPermissionUser'));

// news
const EditNews = lazyWithRetry(() => import('pages/dashboard/news/show/EditNews'));
const ShowNews = lazyWithRetry(() => import('pages/dashboard/news/show/ShowNews'));
const NewsShowList = lazyWithRetry(() => import('pages/dashboard/news/show/ShowList'));

const EditNewsGroup = lazyWithRetry(() => import('pages/dashboard/news/group/EditNewsGroup'));
const NewsGroupShowList = lazyWithRetry(() => import('pages/dashboard/news/group/ShowList'));

const EditNewsSubgroup = lazyWithRetry(() => import('pages/dashboard/news/subgroup/EditNewsSubgroup'));
const NewsSubgroupShowList = lazyWithRetry(() => import('pages/dashboard/news/subgroup/ShowList'));

const NewsGroupOrder = lazyWithRetry(() => import('pages/dashboard/news/groupOrder/ShowOrder'));

const EditNewsUserMember = lazyWithRetry(() => import('pages/dashboard/news/user/EditUserMember'));
const NewsNewUserMemberShowList = lazyWithRetry(() => import('pages/dashboard/news/user/ShowList'));

const NewsLikeShowList = lazyWithRetry(() => import('pages/dashboard/news/like/ShowList'));

const CommentShowList = lazyWithRetry(() => import('pages/dashboard/comment/comment/ShowList'));
const CommentLikeShowList = lazyWithRetry(() => import('pages/dashboard/comment/like/ShowList'));

const FriendChatList = lazyWithRetry(() => import('pages/dashboard/message/friend/ShowList'));
const FriendChat = lazyWithRetry(() => import('pages/dashboard/message/friend/Chat'));

// permission
const PermissionRole = lazyWithRetry(() => import('pages/dashboard/setting/role/ShowList'));

const EditRoles = lazyWithRetry(() => import('pages/dashboard/setting/role/EditRoles'));
// setting

const ApplicationShowList = lazyWithRetry(() => import('pages/dashboard/setting/application/ShowList'));
const EditApplication = lazyWithRetry(() => import('pages/dashboard/setting/application/EditApplication'));

// notifications
const BroadcastNotification = lazyWithRetry(() => import('pages/dashboard/notifications/BroadcastNotification'));
const ShowGroupNotification = lazyWithRetry(() => import('pages/dashboard/notifications/group/ShowGroupNotifInfo'));

const ReportsShowList = lazyWithRetry(() => import('pages/dashboard/report/show/ShowList'));
const EditReports = lazyWithRetry(() => import('pages/dashboard/report/show/ShowReport'));

const Dashboard: Array<dashboardRouteProps> = [
  {
    title: i18n.t('side_menu:dashboard'),
    icon: <HomeOutlined />,
    key: 'dashboard',
    route: '/dashboard',
    cmp: <DashboardCmp />
  },
  {
    title: i18n.t('side_menu:profile'),
    key: 'profile',
    route: '/profile',
    hidden: true,
    cmp: <EditUser />
  },
  {
    title: i18n.t('side_menu:organization'),
    icon: <BankOutlined />,
    key: 'organization',
    subs: [
      {
        key: 'organizationList',
        route: '/organization/organization/list',
        cmp: <OrganizationShowList />,
        title: i18n.t('side_menu:organizations'),
        permission: 'OrganizationUnits',
        forSuperAdmin: true
        // extra: {
        //   route: '/organization/organization/create',
        //   title: i18n.t('side_menu:addOrganization'),
        //   permission: 'OrganizationUnits'
        // }
      },
      {
        key: 'organizationCreate',
        route: '/organization/organization/create',
        cmp: <EditOrganization />,
        title: i18n.t('side_menu:addOrganization'),
        hidden: true,
        permission: 'OrganizationUnits'
      },
      {
        key: 'organizationEdit',
        route: '/organization/organization/edit/:id',
        cmp: <EditOrganization />,
        title: i18n.t('side_menu:editOrganization'),
        permission: 'OrganizationUnits',
        hidden: true
      },
      {
        key: 'organizationShow',
        route: '/organization/organization/show/:id',
        cmp: <ShowOrganization />,
        title: i18n.t('side_menu:showOrganization'),
        permission: 'OrganizationUnits',
        hidden: true
      },
      {
        key: 'organizationGraphList',
        route: '/organization/graph/list',
        cmp: <OrganizationsShowGraph />,
        title: i18n.t('side_menu:graph'),
        permission: 'OrganizationUnits'
      },
      {
        key: 'organizationGraphList',
        route: '/organization/graph/show/:id',
        cmp: <OrganizationChartGraph />,
        title: i18n.t('side_menu:graph'),
        permission: 'OrganizationUnits',
        hidden: true
      }
    ]
  },
  {
    title: i18n.t('side_menu:identity'),
    icon: <UserOutlined />,
    key: 'user',
    subs: [
      {
        key: 'userList',
        route: '/user/list',
        cmp: <UserShowList />,
        title: i18n.t('side_menu:users'),
        permission: 'users.view',
        extra: {
          route: '/user/create',
          title: i18n.t('side_menu:add_user'),
          permission: 'users.store'
        }
      },
      {
        key: 'userList',
        route: '/user/show/:id/organizations',
        cmp: <OrganizationUserShowList />,
        title: i18n.t('side_menu:users'),
        hidden: true,
        permission: 'users.view'
      },
      {
        key: 'userShow',
        route: '/user/show/:id',
        cmp: <UserShow />,
        title: i18n.t('side_menu:show-user'),
        hidden: true,
        permission: 'users.view'
      },
      {
        key: 'userCreate',
        route: '/user/create',
        cmp: <CreateUser />,
        title: i18n.t('side_menu:add-user'),
        hidden: true,
        permission: 'users.store'
      },
      {
        key: 'userEdit',
        route: '/user/edit/:idUser',
        cmp: <EditUser />,
        title: i18n.t('side_menu:edit-user'),
        permission: 'users.update',
        hidden: true
      },
      {
        key: 'showUser',
        route: '/user/edit/:id',
        cmp: <ShowUser />,
        title: i18n.t('side_menu:edit-user'),
        permission: 'users.update',
        hidden: true
      },
      {
        key: 'userPermission',
        route: '/user/permission/:id',
        cmp: <EditPermissionUser />,
        title: i18n.t('side_menu:create'),
        hidden: true,
        permission: 'users.update'
      },
      {
        key: 'newsMember',
        route: '/news/member/list',
        cmp: <NewsNewUserMemberShowList />,
        title: i18n.t('side_menu:news_member'),
        permission: 'NewsMember'
        // extra: {
        //   route: '/news/member/create',
        //   title: i18n.t('side_menu:news_member'),
        //   permission: 'NewsMember'
        // }
      },
      {
        key: 'newsMemberCreate',
        route: '/news/member/create',
        cmp: <EditNewsUserMember />,
        forSuperAdmin: true,
        title: i18n.t('side_menu:addNewsMember'),
        hidden: true,
        permission: 'NewsMember'
      },
      {
        key: 'newsGroupEdit',
        route: '/news/member/edit/:id',
        cmp: <EditNewsUserMember />,
        title: i18n.t('side_menu:editNewsMember'),
        permission: 'NewsMember',
        hidden: true
      }
    ]
  },
  {
    title: i18n.t('side_menu:news'),
    icon: <FileTextOutlined />,
    key: 'news',
    subs: [
      {
        key: 'newsList',
        route: '/news/news/list',
        cmp: <NewsShowList />,
        title: i18n.t('side_menu:news'),
        permission: 'NewsUnits',
        extra: {
          route: '/news/news/create',
          title: i18n.t('side_menu:addNews'),
          permission: 'NewsUnits'
        }
      },
      {
        key: 'newsCreate',
        route: '/news/news/create',
        cmp: <EditNews />,
        title: i18n.t('side_menu:addNews'),
        hidden: true,
        permission: 'NewsUnits'
      },
      {
        key: 'newsEdit',
        route: '/news/news/edit/:id',
        cmp: <EditNews />,
        title: i18n.t('side_menu:editNews'),
        permission: 'NewsUnits',
        hidden: true
      },
      {
        key: 'newsShow',
        route: '/news/news/show/:id',
        cmp: <ShowNews />,
        title: i18n.t('side_menu:editNews'),
        permission: 'NewsUnits',
        hidden: true
      },
      {
        key: 'newsGroupList',
        route: '/news/group/list',
        cmp: <NewsGroupShowList />,
        title: i18n.t('side_menu:group'),
        permission: 'newsUnits',
        extra: {
          route: '/news/group/create',
          title: i18n.t('side_menu:addNewsGroup'),
          permission: 'newsUnits'
        }
      },
      {
        key: 'newsGroupCreate',
        route: '/news/group/create',
        cmp: <EditNewsGroup />,
        title: i18n.t('side_menu:addnewsGroup'),
        hidden: true,
        permission: 'newsUnits'
      },
      {
        key: 'newsGroupEdit',
        route: '/news/group/edit/:id',
        cmp: <EditNewsGroup />,
        title: i18n.t('side_menu:editNewsGroup'),
        permission: 'newsUnits',
        hidden: true
      },
      {
        key: 'newsSubgroupList',
        route: '/news/subgroup/list',
        cmp: <NewsSubgroupShowList />,
        title: i18n.t('side_menu:subgroup'),
        permission: 'newsUnits',
        extra: {
          route: '/news/subgroup/create',
          title: i18n.t('side_menu:addNewsSubgroup'),
          permission: 'newsUnits'
        },
        hidden: true
      },
      {
        key: 'newsSubgroupCreate',
        route: '/news/subgroup/create',
        cmp: <EditNewsSubgroup />,
        title: i18n.t('side_menu:addnewsSubGroup'),
        hidden: true,
        permission: 'newsUnits'
      },
      {
        key: 'newsSubgroupEdit',
        route: '/news/subgroup/edit/:id',
        cmp: <EditNewsSubgroup />,
        title: i18n.t('side_menu:editNewsSubgroup'),
        permission: 'newsUnits',
        hidden: true
      },
      {
        key: 'newsGroupList',
        route: '/news/group/order',
        cmp: <NewsGroupOrder />,
        title: i18n.t('side_menu:order_group'),
        permission: 'NewsUnits'
      },
      {
        route: '/news/like/list',
        cmp: <NewsLikeShowList />,
        title: i18n.t('side_menu:likes'),
        permission: 'comments.view'
      }
    ]
  },
  {
    title: i18n.t('side_menu:comments'),
    icon: <MessageOutlined />,
    key: 'comment',
    subs: [
      {
        route: '/comment/comment/list',
        cmp: <CommentShowList />,
        title: i18n.t('side_menu:comments'),
        permission: 'comments.view'
      },
      {
        route: '/comment/like/list',
        cmp: <CommentLikeShowList />,
        title: i18n.t('side_menu:comment_likes'),
        permission: 'comments.view'
      }
    ]
  },
  {
    title: i18n.t('side_menu:messages'),
    icon: <MailOutlined />,
    key: 'message',
    subs: [
      {
        route: '/message/friend/list',
        cmp: <FriendChatList />,
        title: i18n.t('side_menu:friends'),
        permission: 'support_messages.view'
      },
      {
        route: '/message/friend/:user_id',
        cmp: <FriendChat />,
        title: i18n.t('side_menu:friends'),
        permission: 'support_messages.store',
        hidden: true
      }
    ]
  },
  {
    title: i18n.t('side_menu:notifications'),
    icon: <BellOutlined />,
    forSuperAdmin: true,
    key: 'notifications',
    subs: [
      {
        route: '/notifications/group/:id',
        cmp: <ShowGroupNotification />,
        permission: 'notifications.broadcast',
        hidden: true
      },
      {
        route: '/notifications/broadcast',
        cmp: <BroadcastNotification />,
        title: i18n.t('side_menu:notification_send'),
        permission: 'notifications.broadcast'
      }
    ]
  },
  {
    title: i18n.t('side_menu:setting'),
    icon: <SettingOutlined />,
    key: 'setting',
    forSuperAdmin: true,
    subs: [
      {
        route: '/setting/role/list',
        cmp: <PermissionRole />,
        title: i18n.t('side_menu:show_roles'),
        permission: 'roles.view'
      },
      {
        route: '/setting/role/edit/:id',
        cmp: <EditRoles />,
        title: i18n.t('side_menu:show_role'),
        hidden: true,
        permission: 'roles.update'
      },
      {
        route: '/setting/application/list',
        cmp: <ApplicationShowList />,
        title: i18n.t('side_menu:show_application'),
        permission: 'versions.view',
        extra: {
          route: '/setting/application/create',
          title: i18n.t('side_menu:create_application'),
          permission: 'versions.store'
        }
      },
      {
        route: '/setting/application/create',
        cmp: <EditApplication />,
        title: i18n.t('side_menu:show_application'),
        permission: 'versions.store',
        hidden: true
      },
      {
        route: '/setting/application/edit/:id',
        cmp: <EditApplication />,
        title: i18n.t('side_menu:show_faq_group'),
        permission: 'versions.update',
        hidden: true
      }
    ]
  },
  {
    title: i18n.t('side_menu:reports'),
    icon: <SlidersOutlined />,
    route: '/report/reports/list',
    cmp: <ReportsShowList />,
    permission: 'statistics.view',
    key: 'report',
    hidden: true,
    subs: [
      {
        key: 'newsGroupEdit',
        route: '/report/reports/edit/:id',
        cmp: <EditReports />,
        title: i18n.t('side_menu:reports'),
        permission: 'NewsMember',
        hidden: true
      }
    ]
  }
];

export const getFilteredMenusList = (permissions: string[], isSuperUser?: boolean) =>
  compact(
    map(Dashboard, (menuItem: any) => {
      if (!menuItem?.forSuperAdmin || isSuperUser)
        if (!menuItem?.permission || true || includes(permissions, menuItem?.permission))
          return {
            ...menuItem,
            subs: compact(
              map(menuItem?.subs, (firstSub: any) => {
                // if (true || includes(permissions, firstSub?.permission))
                if (!firstSub?.forSuperAdmin || isSuperUser) {
                  return {
                    ...firstSub,
                    extra: (includes(permissions, firstSub?.extra?.permission) || true) && firstSub?.extra,
                    subs: filter(
                      firstSub?.subs,
                      (secondSub: any) => true || includes(permissions, secondSub?.permission)
                    )
                  };
                }
              })
            )
          };
    })
  );

export default Dashboard;
