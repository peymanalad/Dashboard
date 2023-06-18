import React from 'react';
import {
  FileTextOutlined,
  MailOutlined,
  UserOutlined,
  FileOutlined,
  DropboxOutlined,
  ReconciliationOutlined,
  MessageOutlined,
  BulbOutlined,
  QuestionOutlined,
  SettingOutlined,
  HomeOutlined,
  SlidersOutlined,
  BellOutlined
} from '@ant-design/icons';
import {i18n} from 'libs';
import includes from 'lodash/includes';
import map from 'lodash/map';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import {lazyWithRetry} from 'utils';
import {dashboardRouteProps} from 'types/dashboard';

const DashboardCmp = lazyWithRetry(() => import('pages/dashboard/Dashboard'));
const Reports = lazyWithRetry(() => import('pages/dashboard/report/Reports'));
const ReportTable = lazyWithRetry(() => import('pages/dashboard/report/TableReport'));
// prescription
const MedicineShowList = lazyWithRetry(() => import('pages/dashboard/prescription/medicine/ShowList'));
const EditMedicine = lazyWithRetry(() => import('pages/dashboard/prescription/medicine/EditMedicine'));
const UnitsShowList = lazyWithRetry(() => import('pages/dashboard/prescription/unit/ShowList'));
const UnitsEdit = lazyWithRetry(() => import('pages/dashboard/prescription/unit/EditUnit'));
const UsageShowList = lazyWithRetry(() => import('pages/dashboard/prescription/usage/ShowList'));
const UsageEdit = lazyWithRetry(() => import('pages/dashboard/prescription/usage/EditUsage'));
const TimesShowList = lazyWithRetry(() => import('pages/dashboard/prescription/times/ShowList'));
const TimesEdit = lazyWithRetry(() => import('pages/dashboard/prescription/times/EditTimes'));
const AmountsShowList = lazyWithRetry(() => import('pages/dashboard/prescription/amount/ShowList'));
const AmountsEdit = lazyWithRetry(() => import('pages/dashboard/prescription/amount/EditAmounts'));
const PrescriptionReport = lazyWithRetry(() => import('pages/dashboard/prescription/PrescriptionReport'));

// visit
const FileView = lazyWithRetry(() => import('pages/dashboard/visit/ShowList'));
const ShowVisit = lazyWithRetry(() => import('pages/dashboard/visit/ShowVisit'));
const EditCreate = lazyWithRetry(() => import('pages/dashboard/visit/EditVisit'));
const CreateVisit = lazyWithRetry(() => import('pages/dashboard/visit/CreateVisit'));
const VisitReport = lazyWithRetry(() => import('pages/dashboard/visit/VisitReport'));
// education
const CreateRecommendation = lazyWithRetry(() => import('pages/dashboard/education/recommendation/EditRecommendation'));
const EditRecommendation = lazyWithRetry(() => import('pages/dashboard/education/recommendation/EditRecommendation'));
const EducationReportRcmnd = lazyWithRetry(() => import('pages/dashboard/education/recommendation/Report'));
const EducationCommentRcmnd = lazyWithRetry(() => import('pages/dashboard/education/recommendation/Comment'));
const DoctorCommentRcmnd = lazyWithRetry(() => import('pages/dashboard/comment/doctor/ShowList'));
const PatientCommentRcmnd = lazyWithRetry(() => import('pages/dashboard/comment/patient/ShowList'));
const PatientComment = lazyWithRetry(() => import('pages/dashboard/comment/patient/Comment'));
const DoctorComment = lazyWithRetry(() => import('pages/dashboard/comment/doctor/Comment'));
const EducationViewCare = lazyWithRetry(() => import('pages/dashboard/education/care/ShowList'));
const EducationCareView = lazyWithRetry(() => import('pages/dashboard/education/care/ViewCare'));
const EducationEditCare = lazyWithRetry(() => import('pages/dashboard/education/care/EditCare'));
const EducationCareTree = lazyWithRetry(() => import('pages/dashboard/education/careTree/ShowTree'));
const EducationViewRcmnd = lazyWithRetry(() => import('pages/dashboard/education/recommendation/ShowList'));
const EducationViewSource = lazyWithRetry(() => import('pages/dashboard/education/source/ShowList'));

const EducationRecommendationLogAll = lazyWithRetry(
  () => import('pages/dashboard/education/recommendationLog/ShowList')
);
const EducationRecommendationLogDisease = lazyWithRetry(
  () => import('pages/dashboard/education/recommendationLog/disease/ShowList')
);
const EducationRecommendationLogDoctor = lazyWithRetry(
  () => import('pages/dashboard/education/recommendationLog/doctor/ShowList')
);
const EducationRecommendationLogDoctorDisease = lazyWithRetry(
  () => import('pages/dashboard/education/recommendationLog/doctor/disease/ShowList')
);

const EducationEditSource = lazyWithRetry(() => import('pages/dashboard/education/source/EditSource'));
const EducationViewTag = lazyWithRetry(() => import('pages/dashboard/education/tag/ShowList'));

const ReferenceShowList = lazyWithRetry(() => import('pages/dashboard/education/reference/ShowList'));
const EditReference = lazyWithRetry(() => import('pages/dashboard/education/reference/EditReference'));

const CategoryShowList = lazyWithRetry(() => import('pages/dashboard/education/category/ShowList'));
const EditCategory = lazyWithRetry(() => import('pages/dashboard/education/category/EditCategory'));

const SubjectShowList = lazyWithRetry(() => import('pages/dashboard/education/subject/ShowList'));
const EditSubject = lazyWithRetry(() => import('pages/dashboard/education/subject/EditSubject'));

const NutritionalShowList = lazyWithRetry(() => import('pages/dashboard/education/nutritional/ShowList'));
const EditNutritional = lazyWithRetry(() => import('pages/dashboard/education/nutritional/EditNutritional'));

const EducationEditTag = lazyWithRetry(() => import('pages/dashboard/education/tag/EditTag'));

const WarningShowList = lazyWithRetry(() => import('pages/dashboard/education/warning/ShowList'));

// organization
const EditOrganization = lazyWithRetry(() => import('pages/dashboard/organization/show/EditOrganization'));
const OrganizationShowList = lazyWithRetry(() => import('pages/dashboard/organization/show/ShowList'));

const EditOrganizationGroup = lazyWithRetry(() => import('pages/dashboard/organization/group/EditOrganizationGroup'));
const OrganizationGroupShowList = lazyWithRetry(() => import('pages/dashboard/organization/group/ShowList'));

// user
const EditUser = lazyWithRetry(() => import('pages/dashboard/user/show/EditUser'));
const CreateUser = lazyWithRetry(() => import('pages/dashboard/user/show/CreateUser'));
const UserShowList = lazyWithRetry(() => import('pages/dashboard/user/show/ShowList'));
const UserShow = lazyWithRetry(() => import('pages/dashboard/user/show/ShowUser'));
const UserSpecialization = lazyWithRetry(() => import('pages/dashboard/user/specialization/ShowList'));
const EditSpecializations = lazyWithRetry(() => import('pages/dashboard/user/specialization/EditSpecialization'));
const UserDrReport = lazyWithRetry(() => import('pages/dashboard/user/DrReport'));
const UserTmpRegister = lazyWithRetry(() => import('pages/dashboard/user/temporary/ShowList'));
const EditPermissionUser = lazyWithRetry(() => import('pages/dashboard/user/show/EditPermissionUser'));
const UserReport = lazyWithRetry(() => import('pages/dashboard/user/UserReport'));
const UserReportTable = lazyWithRetry(() => import('pages/dashboard/user/UserReportTable'));
const ShowListEmergency = lazyWithRetry(() => import('pages/dashboard/user/emergency/ShowList'));
const ShowEmergency = lazyWithRetry(() => import('pages/dashboard/user/emergency/ShowEmergency'));

// news
const EditNews = lazyWithRetry(() => import('pages/dashboard/news/show/EditNews'));
const NewsShowList = lazyWithRetry(() => import('pages/dashboard/news/show/ShowList'));

const EditNewsGroup = lazyWithRetry(() => import('pages/dashboard/news/group/EditNewsGroup'));
const NewsGroupShowList = lazyWithRetry(() => import('pages/dashboard/news/group/ShowList'));

const EditNewsUserMember = lazyWithRetry(() => import('pages/dashboard/news/user/EditUserMember'));
const NewsNewUserMemberShowList = lazyWithRetry(() => import('pages/dashboard/news/user/ShowList'));

// order
const ServiceShowList = lazyWithRetry(() => import('pages/dashboard/order/service/ShowList'));
const EditService = lazyWithRetry(() => import('pages/dashboard/order/service/EditService'));
const CouponShowList = lazyWithRetry(() => import('pages/dashboard/order/coupon/ShowList'));
const EditCoupon = lazyWithRetry(() => import('pages/dashboard/order/coupon/EditCoupon'));
const CouponGroupShowList = lazyWithRetry(() => import('pages/dashboard/order/couponGroup/ShowList'));
const EditCouponGroup = lazyWithRetry(() => import('pages/dashboard/order/couponGroup/EditCouponGroup'));
const FactorShowList = lazyWithRetry(() => import('pages/dashboard/order/factor/ShowList'));
const ShowFactor = lazyWithRetry(() => import('pages/dashboard/order/factor/ShowFactor'));
const CreateFactor = lazyWithRetry(() => import('pages/dashboard/order/factor/CreateFactor'));
const TaxShowList = lazyWithRetry(() => import('pages/dashboard/order/tax/ShowList'));
const OrderReport = lazyWithRetry(() => import('pages/dashboard/order/Report'));

// product
const ProductShowList = lazyWithRetry(() => import('pages/dashboard/product/product/ShowList'));
const EditProduct = lazyWithRetry(() => import('pages/dashboard/product/product/EditProduct'));
// productGroup
const ProductGroupShowList = lazyWithRetry(() => import('pages/dashboard/product/group/ShowList'));
const EditProductGroup = lazyWithRetry(() => import('pages/dashboard/product/group/EditGroup'));
// productReport
const ShowReport = lazyWithRetry(() => import('pages/dashboard/product/ShowReport'));

// question
const QuestionShowList = lazyWithRetry(() => import('pages/dashboard/question/question/ShowList'));
const EditQuestion = lazyWithRetry(() => import('pages/dashboard/question/question/EditQuestion'));
const AnswerShowList = lazyWithRetry(() => import('pages/dashboard/question/answer/ShowList'));
const AnswerDetailShowList = lazyWithRetry(() => import('pages/dashboard/question/answer_detail/ShowList'));
const ShowAnswer = lazyWithRetry(() => import('pages/dashboard/question/answer_detail/ShowAnswer'));
const ShowTree = lazyWithRetry(() => import('pages/dashboard/question/tree/ShowTree'));
const AnswerReport = lazyWithRetry(() => import('pages/dashboard/question/AnswerReport'));
// questionGroup
const QuestionGroupShowList = lazyWithRetry(() => import('pages/dashboard/question/group/ShowList'));
const EditQuestionGroup = lazyWithRetry(() => import('pages/dashboard/question/group/EditGroup'));

// message
const DefaultMessageShowList = lazyWithRetry(() => import('pages/dashboard/message/default/ShowList'));
const EditDefaultMessage = lazyWithRetry(() => import('pages/dashboard/message/default/EditDefault'));
// const BroadcastNotification = lazyWithRetry(() => import('pages/dashboard/message/notification/BroadcastNotification'));
const SupportChatList = lazyWithRetry(() => import('pages/dashboard/message/support/ShowList'));
const SupportChat = lazyWithRetry(() => import('pages/dashboard/message/support/Chat'));
const TicketList = lazyWithRetry(() => import('pages/dashboard/message/ticket/ShowList'));
const ShowTicket = lazyWithRetry(() => import('pages/dashboard/message/ticket/ShowTicket'));

// permission
const PermissionRole = lazyWithRetry(() => import('pages/dashboard/setting/role/ShowList'));
const Permissions = lazyWithRetry(() => import('pages/dashboard/setting/permission/ShowList'));
const EditPermissions = lazyWithRetry(() => import('pages/dashboard/setting/permission/EditPermissions'));
const EditRoles = lazyWithRetry(() => import('pages/dashboard/setting/role/EditRoles'));
const EditPermissionOnRole = lazyWithRetry(() => import('pages/dashboard/setting/role/EditPermissionOnRole'));
// setting
const LanguageShowList = lazyWithRetry(() => import('pages/dashboard/setting/Language/ShowList'));
const EditLanguage = lazyWithRetry(() => import('pages/dashboard/setting/Language/EditLanguage'));
const BehaviorShowList = lazyWithRetry(() => import('pages/dashboard/setting/behavior/ShowList'));
const EditBehavior = lazyWithRetry(() => import('pages/dashboard/setting/behavior/EditBehavior'));
const SettingShows = lazyWithRetry(() => import('pages/dashboard/setting/config/ShowList'));
const SettingEditShows = lazyWithRetry(() => import('pages/dashboard/setting/config/EditConfig'));
const SettingNewShows = lazyWithRetry(() => import('pages/dashboard/setting/config/EditConfig'));
const LocationShowList = lazyWithRetry(() => import('pages/dashboard/setting/location/ShowList'));
const EditLocation = lazyWithRetry(() => import('pages/dashboard/setting/location/EditLocation'));
const ApplicationShowList = lazyWithRetry(() => import('pages/dashboard/setting/application/ShowList'));
const EditApplication = lazyWithRetry(() => import('pages/dashboard/setting/application/EditApplication'));
const FaqGroupShowList = lazyWithRetry(() => import('pages/dashboard/setting/faqGroup/ShowList'));
const EditFaqGroup = lazyWithRetry(() => import('pages/dashboard/setting/faqGroup/EditFaqGroup'));
const SortFaqGroup = lazyWithRetry(() => import('pages/dashboard/setting/faqGroup/ShowSort'));
const FaqShowList = lazyWithRetry(() => import('pages/dashboard/setting/faq/ShowList'));
const EditFaq = lazyWithRetry(() => import('pages/dashboard/setting/faq/EditFaq'));

// notifications
const BroadcastNotification = lazyWithRetry(() => import('pages/dashboard/notifications/BroadcastNotification'));
const NotificationShowList = lazyWithRetry(() => import('pages/dashboard/notifications/ShowList'));
const NotificationsShowList = lazyWithRetry(() => import('pages/dashboard/notifications/group/ShowList'));
const ShowGroupNotification = lazyWithRetry(() => import('pages/dashboard/notifications/group/ShowGroupNotifInfo'));

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
    icon: <UserOutlined />,
    key: 'organization',
    subs: [
      {
        key: 'organizationList',
        route: '/organization/organization/list',
        cmp: <OrganizationShowList />,
        title: i18n.t('side_menu:organizations'),
        permission: 'OrganizationUnits',
        extra: {
          route: '/organization/organization/create',
          title: i18n.t('side_menu:addOrganization'),
          permission: 'OrganizationUnits'
        }
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
        key: 'organizationGroupList',
        route: '/organization/group/list',
        cmp: <OrganizationGroupShowList />,
        title: i18n.t('side_menu:group'),
        permission: 'OrganizationUnits',
        extra: {
          route: '/organization/group/create',
          title: i18n.t('side_menu:addOrganizationGroup'),
          permission: 'OrganizationUnits'
        }
      },
      {
        key: 'organizationGroupCreate',
        route: '/organization/group/create',
        cmp: <EditOrganizationGroup />,
        title: i18n.t('side_menu:addOrganizationGroup'),
        hidden: true,
        permission: 'OrganizationUnits'
      },
      {
        key: 'organizationGroupEdit',
        route: '/organization/group/edit/:id',
        cmp: <EditOrganizationGroup />,
        title: i18n.t('side_menu:editOrganizationGroup'),
        permission: 'OrganizationUnits',
        hidden: true
      }
    ]
  },
  {
    title: i18n.t('side_menu:user'),
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
        key: 'userPermission',
        route: '/user/permission/:id',
        cmp: <EditPermissionUser />,
        title: i18n.t('side_menu:create'),
        hidden: true,
        permission: 'users.update'
      }
      // {
      //   key: 'userSpecialization',
      //   route: '/user/specialization/list',
      //   cmp: <UserSpecialization />,
      //   title: i18n.t('side_menu:show_specialization'),
      //   permission: 'specializations.view',
      //   extra: {
      //     route: '/user/specialization/create',
      //     title: i18n.t('side_menu:create_specialization'),
      //     permission: 'specializations.store'
      //   }
      // },
      // {
      //   key: 'userSpecializationCreate',
      //   route: '/user/specialization/create',
      //   cmp: <EditSpecializations />,
      //   title: i18n.t('side_menu:user_specialization'),
      //   permission: 'specializations.store',
      //   hidden: true
      // },
      // {
      //   route: '/user/specialization/edit/:id',
      //   cmp: <EditSpecializations />,
      //   title: i18n.t('side_menu:user_specialization'),
      //   permission: 'specializations.update',
      //   hidden: true
      // },
      // {
      //   route: '/user/DrReport/:id',
      //   cmp: <UserDrReport />,
      //   title: i18n.t('side_menu:dr_report'),
      //   permission: 'users.doctor_report',
      //   hidden: true
      // },
      // {
      //   route: '/user/temporary/list',
      //   cmp: <UserTmpRegister />,
      //   title: i18n.t('side_menu:show_temporary'),
      //   permission: 'temporaries.view'
      // },
      // {
      //   route: '/user/report/',
      //   cmp: <UserReport />,
      //   title: i18n.t('side_menu:report'),
      //   permission: 'users.report'
      // },
      // {
      //   route: '/user/emergency/list',
      //   cmp: <ShowListEmergency />,
      //   title: i18n.t('side_menu:emergency'),
      //   permission: 'important_answers.view'
      // },
      // {
      //   route: '/user/emergency/view/:id',
      //   cmp: <ShowEmergency />,
      //   permission: 'important_answer.view',
      //   hidden: true
      // },
      // {
      //   route: '/user/report/table',
      //   cmp: <UserReportTable />,
      //   title: i18n.t('side_menu:report'),
      //   permission: 'users.report',
      //   hidden: true
      // }
    ]
  },
  {
    title: i18n.t('side_menu:news'),
    icon: <UserOutlined />,
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
        key: 'newsGroupList',
        route: '/news/group/list',
        cmp: <NewsGroupShowList />,
        title: i18n.t('side_menu:group'),
        permission: 'NewsUnits',
        extra: {
          route: '/news/group/create',
          title: i18n.t('side_menu:addNewsGroup'),
          permission: 'NewsUnits'
        }
      },
      {
        key: 'newsGroupCreate',
        route: '/news/group/create',
        cmp: <EditNewsGroup />,
        title: i18n.t('side_menu:addNewsGroup'),
        hidden: true,
        permission: 'NewsUnits'
      },
      {
        key: 'newsGroupEdit',
        route: '/news/group/edit/:id',
        cmp: <EditNewsGroup />,
        title: i18n.t('side_menu:editNewsGroup'),
        permission: 'NewsUnits',
        hidden: true
      },
      {
        key: 'newsMember',
        route: '/news/member/list',
        cmp: <NewsNewUserMemberShowList />,
        title: i18n.t('side_menu:news_member'),
        permission: 'NewsMember',
        extra: {
          route: '/news/member/create',
          title: i18n.t('side_menu:news_member'),
          permission: 'NewsMember'
        }
      },
      {
        key: 'newsMemberCreate',
        route: '/news/member/create',
        cmp: <EditNewsUserMember />,
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
  // {
  //   title: i18n.t('side_menu:file'),
  //   icon: <FileOutlined />,
  //   key: 'visits',
  //   subs: [
  //     {
  //       route: '/visits/list/',
  //       cmp: <FileView />,
  //       title: i18n.t('side_menu:file_view'),
  //       permission: 'visits.view'
  //     },
  //     {
  //       route: '/visits/report/',
  //       cmp: <VisitReport />,
  //       title: i18n.t('side_menu:report'),
  //       permission: 'visits.view'
  //     },
  //     {
  //       route: '/visit/edit/:id',
  //       cmp: <EditCreate />,
  //       title: i18n.t('side_menu:file_create'),
  //       permission: 'visits.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/visit/create',
  //       cmp: <CreateVisit />,
  //       title: i18n.t('side_menu:file_create'),
  //       permission: 'visits.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/visit/show/:id',
  //       cmp: <ShowVisit />,
  //       title: i18n.t('side_menu:file_create'),
  //       permission: 'visits.view',
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   title: i18n.t('side_menu:education'),
  //   icon: <BulbOutlined />,
  //   key: 'education',
  //   subs: [
  //     {
  //       route: '/education/recommendation/list',
  //       cmp: <EducationViewRcmnd />,
  //       title: i18n.t('side_menu:education_view_rcmnd'),
  //       permission: 'recommendations.view',
  //       extra: {
  //         route: '/education/recommendation/create',
  //         title: i18n.t('side_menu:education_create_rcmnd'),
  //         permission: 'recommendations.store'
  //       }
  //     },
  //     {
  //       route: '/education/recommendation/report',
  //       cmp: <EducationReportRcmnd />,
  //       title: i18n.t('side_menu:recommendation_report'),
  //       permission: 'recommendations.report',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/care/list',
  //       cmp: <EducationViewCare />,
  //       title: i18n.t('side_menu:education_view_care'),
  //       permission: 'diseases.view',
  //       extra: {
  //         route: '/education/care/create',
  //         title: i18n.t('side_menu:education_create_care'),
  //         permission: 'diseases.store'
  //       }
  //     },
  //     {
  //       route: '/education/care/show/:id',
  //       cmp: <EducationCareView />,
  //       title: i18n.t('side_menu:education_care_view'),
  //       permission: 'diseases.view',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/care/edit/:id',
  //       cmp: <EducationEditCare />,
  //       title: i18n.t('side_menu:education_edit_care'),
  //       permission: 'diseases.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/care/create',
  //       cmp: <EducationEditCare />,
  //       title: i18n.t('side_menu:education_create_care'),
  //       permission: 'diseases.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/care/tree',
  //       cmp: <EducationCareTree />,
  //       title: i18n.t('side_menu:education_care_tree'),
  //       permission: 'diseases.view',
  //       hidden: false
  //     },
  //     {
  //       route: '/education/recommendation/create',
  //       cmp: <CreateRecommendation />,
  //       title: i18n.t('side_menu:education_create_rcmnd'),
  //       permission: 'recommendations.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/recommendation/edit/comment/:recommendation_id',
  //       cmp: <EducationCommentRcmnd />,
  //       title: i18n.t('side_menu:education_comment_rcmnd'),
  //       permission: 'recommendations.view',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/recommendation/edit/:id',
  //       cmp: <EditRecommendation />,
  //       title: i18n.t('side_menu:education_edit_rcmnd'),
  //       permission: 'recommendations.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/source/list',
  //       cmp: <EducationViewSource />,
  //       title: i18n.t('side_menu:education_view_source'),
  //       permission: 'sources.view',
  //       extra: {
  //         route: '/education/source/create',
  //         title: i18n.t('side_menu:create_education_view_source'),
  //         permission: 'sources.store'
  //       }
  //     },
  //     {
  //       route: '/education/source/create',
  //       cmp: <EducationEditSource />,
  //       title: i18n.t('side_menu:education_view_source'),
  //       permission: 'sources.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/source/edit/:id',
  //       cmp: <EducationEditSource />,
  //       title: i18n.t('side_menu:education_view_source'),
  //       permission: 'sources.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/reference/list',
  //       cmp: <ReferenceShowList />,
  //       title: i18n.t('side_menu:view_reference'),
  //       permission: 'references.view',
  //       extra: {
  //         route: '/education/reference/create',
  //         title: i18n.t('side_menu:create_view_reference'),
  //         permission: 'references.store'
  //       }
  //     },
  //     {
  //       route: '/education/reference/create',
  //       cmp: <EditReference />,
  //       title: i18n.t('side_menu:view_reference'),
  //       permission: 'references.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/reference/edit/:id',
  //       cmp: <EditReference />,
  //       title: i18n.t('side_menu:view_reference'),
  //       permission: 'references.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/category/list',
  //       cmp: <CategoryShowList />,
  //       title: i18n.t('side_menu:view_category'),
  //       permission: 'categories.view',
  //       extra: {
  //         route: '/education/category/create',
  //         title: i18n.t('side_menu:create_view_category'),
  //         permission: 'categories.store'
  //       }
  //     },
  //     {
  //       route: '/education/category/create',
  //       cmp: <EditCategory />,
  //       title: i18n.t('side_menu:view_category'),
  //       permission: 'categories.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/category/edit/:id',
  //       cmp: <EditCategory />,
  //       title: i18n.t('side_menu:view_category'),
  //       permission: 'categories.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/subject/list',
  //       cmp: <SubjectShowList />,
  //       title: i18n.t('side_menu:view_subject'),
  //       permission: 'subjects.view',
  //       extra: {
  //         route: '/education/subject/create',
  //         title: i18n.t('side_menu:create_view_subject'),
  //         permission: 'subjects.store'
  //       }
  //     },
  //     {
  //       route: '/education/subject/create',
  //       cmp: <EditSubject />,
  //       title: i18n.t('side_menu:view_subject'),
  //       permission: 'subjects.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/subject/edit/:id',
  //       cmp: <EditSubject />,
  //       title: i18n.t('side_menu:view_subject'),
  //       permission: 'subjects.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/tag/list',
  //       cmp: <EducationViewTag />,
  //       title: i18n.t('side_menu:view_tag'),
  //       permission: 'tags.view',
  //       extra: {
  //         route: '/education/tag/create',
  //         title: i18n.t('side_menu:create_view_tag'),
  //         permission: 'tags.store'
  //       }
  //     },
  //     {
  //       route: '/education/tag/create',
  //       cmp: <EducationEditTag />,
  //       title: i18n.t('side_menu:view_tag'),
  //       permission: 'tags.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/tag/edit/:id',
  //       cmp: <EducationEditTag />,
  //       title: i18n.t('side_menu:view_nutritional'),
  //       permission: 'tags.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/nutritional/list',
  //       cmp: <NutritionalShowList />,
  //       title: i18n.t('side_menu:view_nutritional'),
  //       permission: 'nutritional_values.view',
  //       extra: {
  //         route: '/education/nutritional/create',
  //         title: i18n.t('side_menu:create_view_nutritional'),
  //         permission: 'nutritional_values.store'
  //       }
  //     },
  //     {
  //       route: '/education/nutritional/create',
  //       cmp: <EditNutritional />,
  //       title: i18n.t('side_menu:view_nutritional'),
  //       permission: 'nutritional_values.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/education/nutritional/edit/:id',
  //       cmp: <EditNutritional />,
  //       title: i18n.t('side_menu:view_tag'),
  //       permission: 'nutritional_values.update',
  //       hidden: true
  //     },
  //     {
  //       title: i18n.t('side_menu:recommendation_log'),
  //       permission: 'recommender_logs.view',
  //       key: 'recommendationLog',
  //       subs: [
  //         {
  //           route: '/education/recommendationLog/all',
  //           cmp: <EducationRecommendationLogAll />,
  //           title: i18n.t('side_menu:recommendation_log_all'),
  //           permission: 'recommender_logs.view'
  //         },
  //         {
  //           route: '/education/recommendationLog/disease',
  //           cmp: <EducationRecommendationLogDisease />,
  //           title: i18n.t('side_menu:recommendation_log_disease'),
  //           permission: 'recommender_logs.view'
  //         },
  //         {
  //           route: '/education/recommendationLog/doctor',
  //           cmp: <EducationRecommendationLogDoctor />,
  //           title: i18n.t('side_menu:recommendation_log_doctor'),
  //           permission: 'recommender_logs.view'
  //         },
  //         {
  //           route: '/education/recommendationLog/doctor/disease/:id',
  //           cmp: <EducationRecommendationLogDoctorDisease />,
  //           title: i18n.t('side_menu:recommendation_log_doctor_diseases'),
  //           hidden: true,
  //           permission: 'recommender_logs.view'
  //         }
  //       ]
  //     },
  //     {
  //       route: '/education/warning/list',
  //       cmp: <WarningShowList />,
  //       title: i18n.t('side_menu:warnings_view'),
  //       permission: 'warnings.view'
  //     }
  //   ]
  // },
  // {
  //   title: i18n.t('side_menu:comments'),
  //   icon: <MessageOutlined />,
  //   key: 'comment',
  //   subs: [
  //     {
  //       route: '/comment/doctor/list',
  //       cmp: <DoctorCommentRcmnd />,
  //       title: i18n.t('side_menu:doctors'),
  //       permission: 'comments.view'
  //     },
  //     {
  //       route: '/comment/doctor/edit/:recommendation_id/:reply_id',
  //       cmp: <DoctorComment />,
  //       title: i18n.t('side_menu:doctors'),
  //       permission: 'comments.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/comment/patient/list',
  //       cmp: <PatientCommentRcmnd />,
  //       title: i18n.t('side_menu:patients'),
  //       permission: 'comments.view'
  //     },
  //     {
  //       route: '/comment/patient/edit/:recommendation_id/:reply_id',
  //       cmp: <PatientComment />,
  //       title: i18n.t('side_menu:patients'),
  //       permission: 'comments.update',
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   title: i18n.t('side_menu:messages'),
  //   icon: <MailOutlined />,
  //   key: 'message',
  //   subs: [
  //     {
  //       route: '/message/default/list',
  //       cmp: <DefaultMessageShowList />,
  //       title: i18n.t('side_menu:default_question_messages_view'),
  //       permission: 'default_question_messages.view',
  //       extra: {
  //         route: '/message/default/create',
  //         title: i18n.t('side_menu:create_default_question_messages'),
  //         permission: 'default_question_messages.store'
  //       }
  //     },
  //     {
  //       route: '/message/default/create',
  //       cmp: <EditDefaultMessage />,
  //       title: i18n.t('side_menu:default_question_messages_view'),
  //       permission: 'default_question_messages.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/message/default/edit/:id',
  //       cmp: <EditDefaultMessage />,
  //       title: i18n.t('side_menu:default_question_messages_view'),
  //       permission: 'default_question_messages.update',
  //       hidden: true
  //     },
  //
  //     {
  //       route: '/message/support/list',
  //       cmp: <SupportChatList />,
  //       title: i18n.t('side_menu:support_view'),
  //       permission: 'support_messages.view'
  //     },
  //     {
  //       route: '/message/support/chat/:user_id',
  //       cmp: <SupportChat />,
  //       title: i18n.t('side_menu:support_view'),
  //       permission: 'support_messages.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/message/ticket/list',
  //       cmp: <TicketList />,
  //       title: i18n.t('side_menu:ticket_view'),
  //       permission: 'tickets.view'
  //     },
  //     {
  //       route: '/message/ticket/:patient_id/:doctor_id',
  //       cmp: <ShowTicket />,
  //       title: i18n.t('side_menu:ticket_view'),
  //       permission: 'messages.view',
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   title: i18n.t('side_menu:orders'),
  //   icon: <ReconciliationOutlined />,
  //   key: 'order',
  //   subs: [
  //     {
  //       route: '/order/service/list',
  //       cmp: <ServiceShowList />,
  //       title: i18n.t('side_menu:service_view'),
  //       permission: 'services.view',
  //       extra: {
  //         route: '/order/service/create',
  //         title: i18n.t('side_menu:service_create'),
  //         permission: 'services.store'
  //       }
  //     },
  //     {
  //       route: '/order/service/create',
  //       cmp: <EditService />,
  //       title: i18n.t('side_menu:service_create'),
  //       permission: 'services.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/order/service/edit/:id',
  //       cmp: <EditService />,
  //       title: i18n.t('side_menu:service_create'),
  //       permission: 'services.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/order/coupon_group/list',
  //       cmp: <CouponGroupShowList />,
  //       title: i18n.t('side_menu:coupon_group_view'),
  //       permission: 'coupons.view',
  //       extra: {
  //         route: '/order/coupon_group/create',
  //         title: i18n.t('side_menu:coupon_group_create'),
  //         permission: 'coupons.store'
  //       }
  //     },
  //     {
  //       route: '/order/coupon_group/create',
  //       cmp: <EditCouponGroup />,
  //       title: i18n.t('side_menu:coupon_group_create'),
  //       permission: 'coupons.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/order/coupon_group/edit/:id',
  //       cmp: <EditCouponGroup />,
  //       title: i18n.t('side_menu:coupon_group_create'),
  //       permission: 'coupons.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/order/coupon/list',
  //       cmp: <CouponShowList />,
  //       title: i18n.t('side_menu:coupon_view'),
  //       permission: 'coupons.view',
  //       extra: {
  //         route: '/order/coupon/create',
  //         title: i18n.t('side_menu:coupon_create'),
  //         permission: 'coupons.store'
  //       }
  //     },
  //     {
  //       route: '/order/coupon/create',
  //       cmp: <EditCoupon />,
  //       title: i18n.t('side_menu:coupon_create'),
  //       permission: 'coupons.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/order/coupon/edit/:id',
  //       cmp: <EditCoupon />,
  //       title: i18n.t('side_menu:coupon_create'),
  //       permission: 'coupons.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/order/factor/list',
  //       cmp: <FactorShowList />,
  //       title: i18n.t('side_menu:factor_view'),
  //       permission: 'orders.view',
  //       extra: {
  //         route: '/order/factor/create',
  //         title: i18n.t('side_menu:factor_create'),
  //         permission: 'coupons.store'
  //       }
  //     },
  //     {
  //       route: '/order/factor/create',
  //       cmp: <CreateFactor />,
  //       title: i18n.t('side_menu:factor_create'),
  //       permission: 'orders.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/order/factor/show/:id',
  //       cmp: <ShowFactor />,
  //       title: i18n.t('side_menu:factor_create'),
  //       permission: 'orders.view',
  //       hidden: true
  //     },
  //     {
  //       route: '/order/tax/list',
  //       cmp: <TaxShowList />,
  //       title: i18n.t('side_menu:tax_view'),
  //       permission: 'orders.view'
  //     },
  //     {
  //       route: '/order/report',
  //       cmp: <OrderReport />,
  //       title: i18n.t('side_menu:order_report'),
  //       permission: 'orders.view'
  //     }
  //   ]
  // },
  // {
  //   title: i18n.t('side_menu:product'),
  //   icon: <DropboxOutlined />,
  //   key: 'product',
  //   subs: [
  //     {
  //       route: '/product/product/list',
  //       cmp: <ProductShowList />,
  //       title: i18n.t('side_menu:product_view'),
  //       permission: 'products.view',
  //       extra: {
  //         route: '/product/product/create',
  //         title: i18n.t('side_menu:product_create'),
  //         permission: 'products.store'
  //       }
  //     },
  //     {
  //       route: '/product/product/create',
  //       cmp: <EditProduct />,
  //       title: i18n.t('side_menu:product_create'),
  //       permission: 'products.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/product/product/edit/:id',
  //       cmp: <EditProduct />,
  //       title: i18n.t('side_menu:product_create'),
  //       permission: 'products.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/product/group/list',
  //       cmp: <ProductGroupShowList />,
  //       title: i18n.t('side_menu:product_group_view'),
  //       permission: 'products.view',
  //       extra: {
  //         route: '/product/group/create',
  //         title: i18n.t('side_menu:create_product_group_view'),
  //         permission: 'products.store'
  //       }
  //     },
  //     {
  //       route: '/product/group/create',
  //       cmp: <EditProductGroup />,
  //       title: i18n.t('side_menu:product_group_view'),
  //       permission: 'products.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/product/group/edit/:id',
  //       cmp: <EditProductGroup />,
  //       title: i18n.t('side_menu:product_group_view'),
  //       permission: 'products.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/product/report',
  //       cmp: <ShowReport />,
  //       title: i18n.t('side_menu:product_report'),
  //       permission: 'products.view'
  //     }
  //   ]
  // },
  // {
  //   title: i18n.t('side_menu:questions'),
  //   icon: <QuestionOutlined />,
  //   key: 'question',
  //   subs: [
  //     {
  //       route: '/question/group/list',
  //       cmp: <QuestionGroupShowList />,
  //       title: i18n.t('side_menu:question_group_view'),
  //       permission: 'questions.view',
  //       extra: {
  //         route: '/question/group/create',
  //         title: i18n.t('side_menu:create_question_group_view'),
  //         permission: 'questions.store'
  //       }
  //     },
  //     {
  //       route: '/question/group/create',
  //       cmp: <EditQuestionGroup />,
  //       title: i18n.t('side_menu:question_group_view'),
  //       permission: 'questions.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/question/group/edit/:id',
  //       cmp: <EditQuestionGroup />,
  //       title: i18n.t('side_menu:question_group_view'),
  //       permission: 'questions.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/question/question/list',
  //       cmp: <QuestionShowList />,
  //       title: i18n.t('side_menu:question_view'),
  //       permission: 'questions.view',
  //       extra: {
  //         route: '/question/question/create',
  //         title: i18n.t('side_menu:create_question_view'),
  //         permission: 'questions.store'
  //       }
  //     },
  //     {
  //       route: '/question/question/create',
  //       cmp: <EditQuestion />,
  //       title: i18n.t('side_menu:question_view'),
  //       permission: 'questions.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/question/question/edit/:id',
  //       cmp: <EditQuestion />,
  //       title: i18n.t('side_menu:question_view'),
  //       permission: 'questions.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/question/tree/list',
  //       cmp: <ShowTree />,
  //       title: i18n.t('side_menu:tree_view'),
  //       permission: 'questions.view'
  //     },
  //     {
  //       route: '/question/answer/list',
  //       cmp: <AnswerShowList />,
  //       title: i18n.t('side_menu:answer_view'),
  //       permission: 'answers.view'
  //     },
  //     {
  //       route: '/question/answer_detail/list',
  //       cmp: <AnswerDetailShowList />,
  //       title: i18n.t('side_menu:answer_detail_view'),
  //       permission: 'answers.view'
  //     },
  //     {
  //       route: '/question/answer_detail/show/:id',
  //       cmp: <ShowAnswer />,
  //       title: i18n.t('side_menu:answer_detail_view'),
  //       permission: 'answers.view',
  //       hidden: true
  //     },
  //     {
  //       route: '/question/report/',
  //       cmp: <AnswerReport />,
  //       title: i18n.t('side_menu:report'),
  //       permission: 'answers.report'
  //     }
  //   ]
  // },
  // {
  //   title: i18n.t('side_menu:prescription'),
  //   icon: <FileTextOutlined />,
  //   key: 'prescription',
  //   subs: [
  //     {
  //       route: '/prescription/medicine/list',
  //       cmp: <MedicineShowList />,
  //       title: i18n.t('side_menu:prescription_view'),
  //       permission: 'prescriptions.view',
  //       extra: {
  //         route: '/prescription/medicine/create',
  //         title: i18n.t('side_menu:prescription_add'),
  //         permission: 'prescriptions.store'
  //       }
  //     },
  //     {
  //       route: '/prescription/medicine/edit/:id',
  //       cmp: <EditMedicine />,
  //       title: i18n.t('side_menu:prescription_edit'),
  //       permission: 'prescriptions.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/medicine/create',
  //       cmp: <EditMedicine />,
  //       title: i18n.t('side_menu:prescription_add'),
  //       permission: 'prescriptions.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/unit/list',
  //       cmp: <UnitsShowList />,
  //       title: i18n.t('side_menu:unit'),
  //       permission: 'units.view',
  //       extra: {
  //         route: '/prescription/unit/create',
  //         title: i18n.t('side_menu:create_unit'),
  //         permission: 'units.store'
  //       }
  //     },
  //     {
  //       route: '/prescription/unit/edit/:id',
  //       cmp: <UnitsEdit />,
  //       title: i18n.t('side_menu:unit'),
  //       permission: 'units.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/unit/create',
  //       cmp: <UnitsEdit />,
  //       title: i18n.t('side_menu:unit'),
  //       permission: 'units.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/usages/list',
  //       cmp: <UsageShowList />,
  //       title: i18n.t('side_menu:prescription_usage'),
  //       permission: 'prescription_usages.view',
  //       extra: {
  //         route: '/prescription/usages/create',
  //         title: i18n.t('side_menu:create_prescription_usage'),
  //         permission: 'prescription_usages.store'
  //       }
  //     },
  //     {
  //       route: '/prescription/usages/edit/:id',
  //       cmp: <UsageEdit />,
  //       title: i18n.t('side_menu:prescription_usage'),
  //       permission: 'prescription_usages.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/usages/create',
  //       cmp: <UsageEdit />,
  //       title: i18n.t('side_menu:prescription_usage'),
  //       permission: 'prescription_usages.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/times/list',
  //       cmp: <TimesShowList />,
  //       title: i18n.t('side_menu:prescription_times'),
  //       permission: 'prescription_times.view',
  //       extra: {
  //         route: '/prescription/times/create',
  //         title: i18n.t('side_menu:create_prescription_times'),
  //         permission: 'prescription_times.store'
  //       }
  //     },
  //     {
  //       route: '/prescription/times/edit/:id',
  //       cmp: <TimesEdit />,
  //       title: i18n.t('side_menu:prescription_times'),
  //       permission: 'prescription_times.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/times/create',
  //       cmp: <TimesEdit />,
  //       title: i18n.t('side_menu:prescription_times'),
  //       permission: 'prescription_times.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/amounts/list',
  //       cmp: <AmountsShowList />,
  //       title: i18n.t('side_menu:prescription_amounts'),
  //       permission: 'prescription_amounts.view',
  //       extra: {
  //         route: '/prescription/amounts/create',
  //         title: i18n.t('side_menu:create_prescription_amounts'),
  //         permission: 'prescription_amounts.store'
  //       }
  //     },
  //     {
  //       route: '/prescription/amounts/create',
  //       cmp: <AmountsEdit />,
  //       title: i18n.t('side_menu:prescription_amounts'),
  //       permission: 'prescription_amounts.store',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/amounts/edit/:id',
  //       cmp: <AmountsEdit />,
  //       title: i18n.t('side_menu:prescription_amounts'),
  //       permission: 'prescription_amounts.update',
  //       hidden: true
  //     },
  //     {
  //       route: '/prescription/report',
  //       cmp: <PrescriptionReport />,
  //       title: i18n.t('side_menu:report'),
  //       permission: 'prescriptions.view'
  //     }
  //   ]
  // },
  // {
  //   title: i18n.t('side_menu:notifications'),
  //   icon: <BellOutlined />,
  //   key: 'notifications',
  //   subs: [
  //     {
  //       route: '/notifications/list',
  //       cmp: <NotificationShowList />,
  //       permission: 'notifications.broadcast',
  //       title: i18n.t('side_menu:notifications_view')
  //     },
  //     {
  //       route: '/notifications/group/list',
  //       cmp: <NotificationsShowList />,
  //       permission: 'notifications.broadcast',
  //       title: i18n.t('side_menu:group_notifications_view')
  //     },
  //     {
  //       route: '/notifications/group/:id',
  //       cmp: <ShowGroupNotification />,
  //       permission: 'notifications.broadcast',
  //       hidden: true
  //       // title: i18n.t('side_menu:group_notifications_view')
  //     },
  //     {
  //       route: '/notifications/broadcast',
  //       cmp: <BroadcastNotification />,
  //       title: i18n.t('side_menu:notification_send'),
  //       permission: 'notifications.broadcast'
  //     }
  //   ]
  // },
  {
    title: i18n.t('side_menu:setting'),
    icon: <SettingOutlined />,
    key: 'setting',
    subs: [
      {
        route: '/setting/role/list',
        cmp: <PermissionRole />,
        title: i18n.t('side_menu:show_roles'),
        permission: 'roles.view',
        extra: {
          route: '/setting/role/new',
          title: i18n.t('side_menu:create_role'),
          permission: 'roles.store'
        }
      },
      {
        route: '/setting/role/new',
        cmp: <EditRoles />,
        title: i18n.t('side_menu:show_roles'),
        hidden: true,
        permission: 'roles.store'
      },
      {
        route: '/setting/role/edit/:id',
        cmp: <EditRoles />,
        title: i18n.t('side_menu:show_role'),
        hidden: true,
        permission: 'roles.update'
      },
      {
        route: '/setting/permission/list',
        cmp: <Permissions />,
        title: i18n.t('side_menu:show_permissions'),
        permission: 'permissions.view',
        extra: {
          route: '/setting/permission/new',
          title: i18n.t('side_menu:create_permission'),
          permission: 'permissions.store'
        }
      },
      {
        route: '/setting/permission/new',
        cmp: <EditPermissions />,
        title: i18n.t('side_menu:show_permissions'),
        hidden: true,
        permission: 'permissions.store'
      },
      {
        route: '/setting/permission/edit/:id',
        cmp: <EditPermissions />,
        title: i18n.t('side_menu:show_permissions'),
        hidden: true,
        permission: 'permissions.update'
      },
      {
        route: '/setting/role/permission/edit/:id',
        cmp: <EditPermissionOnRole />,
        title: i18n.t('side_menu:show_permissions'),
        hidden: true,
        permission: 'roles.update'
      },
      {
        route: '/setting/config/list',
        cmp: <SettingShows />,
        title: i18n.t('side_menu:show_configs'),
        permission: 'configs.view',
        extra: {
          route: '/setting/config/new',
          title: i18n.t('side_menu:create_config'),
          permission: 'configs.store'
        }
      },
      {
        route: '/setting/config/new',
        cmp: <SettingNewShows />,
        title: i18n.t('side_menu:show_configs'),
        permission: 'configs.store',
        hidden: true
      },
      {
        route: '/setting/config/edit/:id',
        cmp: <SettingEditShows />,
        title: i18n.t('side_menu:show_configs'),
        permission: 'configs.update',
        hidden: true
      },
      {
        route: '/setting/language/list',
        cmp: <LanguageShowList />,
        title: i18n.t('side_menu:show_languages'),
        permission: 'languages.view',
        extra: {
          route: '/setting/language/create',
          title: i18n.t('side_menu:create_language'),
          permission: 'languages.store'
        }
      },
      {
        route: '/setting/language/create',
        cmp: <EditLanguage />,
        title: i18n.t('side_menu:show_languages'),
        permission: 'languages.store',
        hidden: true
      },
      {
        route: '/setting/language/edit/:id',
        cmp: <EditLanguage />,
        title: i18n.t('side_menu:show_languages'),
        permission: 'languages.update',
        hidden: true
      },
      {
        route: '/setting/behavior/list',
        cmp: <BehaviorShowList />,
        title: i18n.t('side_menu:show_behavior'),
        permission: 'behaviors.view',
        extra: {
          route: '/setting/behavior/create',
          title: i18n.t('side_menu:create_behavior'),
          permission: 'behaviors.store'
        }
      },
      {
        route: '/setting/behavior/create',
        cmp: <EditBehavior />,
        title: i18n.t('side_menu:show_behavior'),
        permission: 'behaviors.store',
        hidden: true
      },
      {
        route: '/setting/behavior/edit/:id',
        cmp: <EditBehavior />,
        title: i18n.t('side_menu:show_behavior'),
        permission: 'behaviors.update',
        hidden: true
      },
      {
        route: '/setting/location/list',
        cmp: <LocationShowList />,
        title: i18n.t('side_menu:show_location'),
        permission: 'location.view',
        extra: {
          route: '/setting/location/create',
          title: i18n.t('side_menu:create_location'),
          permission: 'location.store',
          hidden: true
        }
      },
      {
        route: '/setting/location/create',
        cmp: <EditLocation />,
        title: i18n.t('side_menu:show_location'),
        permission: 'location.store',
        hidden: true
      },
      {
        route: '/setting/location/edit/:id',
        cmp: <EditLocation />,
        title: i18n.t('side_menu:show_location'),
        permission: 'location.update',
        hidden: true
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
      },
      {
        route: '/setting/faqGroup/list',
        cmp: <FaqGroupShowList />,
        title: i18n.t('side_menu:show_faq_group'),
        permission: 'faq_groups.view',
        extra: {
          route: '/setting/faqGroup/create',
          title: i18n.t('side_menu:create_faq_group'),
          permission: 'faq_groups.store'
        }
      },
      {
        route: '/setting/faqGroup/create',
        cmp: <EditFaqGroup />,
        title: i18n.t('side_menu:show_faq_group'),
        permission: 'faq_groups.store',
        hidden: true
      },
      {
        route: '/setting/faqGroup/edit/:id',
        cmp: <EditFaqGroup />,
        title: i18n.t('side_menu:show_faq_group'),
        permission: 'faq_groups.update',
        hidden: true
      },
      {
        route: '/setting/faqGroup/sort/:id',
        cmp: <SortFaqGroup />,
        title: i18n.t('side_menu:show_faq_group'),
        permission: 'faq_groups.update',
        hidden: true
      },
      {
        route: '/setting/faq/list',
        cmp: <FaqShowList />,
        title: i18n.t('side_menu:show_faq'),
        permission: 'faqs.view',
        extra: {
          route: '/setting/faq/create',
          title: i18n.t('side_menu:create_faq'),
          permission: 'faqs.store'
        }
      },
      {
        route: '/setting/faq/create',
        cmp: <EditFaq />,
        title: i18n.t('side_menu:show_faq'),
        permission: 'faqs.store',
        hidden: true
      },
      {
        route: '/setting/faq/edit/:id',
        cmp: <EditFaq />,
        title: i18n.t('side_menu:show_faq'),
        permission: 'faqs.update',
        hidden: true
      }
    ]
  },
  {
    title: i18n.t('side_menu:report'),
    icon: <SlidersOutlined />,
    route: '/report',
    cmp: <Reports />,
    permission: 'statistics.view',
    key: 'report',
    subs: [
      {
        route: '/report/api',
        cmp: <ReportTable />,
        permission: 'statistics.view',
        hidden: true
      }
    ]
  }
];

export const getFilteredMenusList = (permissions: string[]) =>
  compact(
    map(Dashboard, (menuItem: any) => {
      if (!menuItem?.permission || true || includes(permissions, menuItem?.permission))
        return {
          ...menuItem,
          subs: compact(
            map(menuItem?.subs, (firstSub: any) => {
              if (true || includes(permissions, firstSub?.permission)) {
                return {
                  ...firstSub,
                  extra: (includes(permissions, firstSub?.extra?.permission) || true) && firstSub?.extra,
                  subs: filter(firstSub?.subs, (secondSub: any) => true || includes(permissions, secondSub?.permission))
                };
              }
            })
          )
        };
    })
  );

export default Dashboard;
