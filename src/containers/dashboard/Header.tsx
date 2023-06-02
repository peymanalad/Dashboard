import React, {FC} from 'react';
import {Badge, Row, Space, Tooltip, Typography} from 'antd';
import {
  AlertOutlined,
  CommentOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  FrownOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import {NavLink} from 'react-router-dom';
import qs from 'qs';
import {useTranslation} from 'react-i18next';
import {StethoscopeIcon} from 'assets';

interface Props {
  data: any;
}

const {Text} = Typography;

const HeaderDetail: FC<Props> = ({data}) => {
  const {t} = useTranslation('dashboard');

  return (
    <Space size="large" align="center" className="flex flex-col md:flex-row w-full md:w-unset py-2 px-6 pt-3">
      {Boolean(data?.register_user_count) && (
        <Tooltip title={t('register')} className="py-3 md:p-0 border-divider">
          <NavLink to="/user/temporary/list" className="flex">
            <Badge count={data?.register_user_count} className="w-full" offset={[0, 0]}>
              <Row className="w-full flex flex-row flex-no-wrap p-1">
                <UserAddOutlined className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('register')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
      {Boolean(data?.pending_patient_count) && (
        <Tooltip title={t('pending_patient_count')} className="py-3 md:p-0 border-divider">
          <NavLink to="/visits/list?status=pending" className="flex">
            <Badge count={data?.pending_patient_count} className="w-full" offset={[0, 0]}>
              <Row className="w-full flex flex-row flex-no-wrap p-1">
                <UserSwitchOutlined className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('pending_patient_count')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
      {Boolean(data?.pending_doctor_count) && (
        <Tooltip title={t('pending_doctor_count')} className="py-3 md:p-0 border-divider">
          <NavLink to="/user/list?role_id=2&approve=0" className="flex">
            <Badge count={data?.pending_doctor_count} className="w-full" offset={[0, 0]}>
              <Row className="w-full flex flex-row flex-no-wrap p-1">
                <UserSwitchOutlined className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('pending_doctor_count')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
      {Boolean(data?.new_recommendations_count) && (
        <Tooltip title={t('new_recommendations')} className="py-3 md:p-0 border-divider">
          <NavLink to="/education/recommendation/report?status=new" className="flex">
            <Badge count={data?.new_recommendations_count} className="w-full" offset={[0, 0]}>
              <Row className="w-full flex flex-row flex-no-wrap p-1">
                <FileAddOutlined className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('new_recommendations')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
      {Boolean(data?.doctor_comment_count) && (
        <Tooltip title={t('doctor_comment')} className="py-3 md:p-0 border-divider">
          <NavLink to="/comment/doctor/list" className="flex">
            <Badge count={data?.doctor_comment_count} className="w-full" offset={[0, 0]}>
              <Row className="w-full flex flex-row flex-no-wrap p-1">
                <StethoscopeIcon className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('doctor_comment')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
      {Boolean(data?.not_confirmed_recommendations_count) && (
        <Tooltip title={t('failed_recommendations')} className="py-3 md:p-0 border-divider">
          <NavLink to="/education/recommendation/report?status_confirmed_doctors=not_confirm" className="flex">
            <Badge
              count={data?.not_confirmed_recommendations_count}
              className="w-full flex flex-row flex-no-wrap p-1"
              offset={[0, 0]}>
              <Row className="w-full">
                <FileExcelOutlined className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('failed_recommendations')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
      {Boolean(data?.warnings_count) && (
        <Tooltip title={t('warnings')} className="py-3 md:p-0 border-divider">
          <NavLink to="/education/warning/list" className="flex">
            <Badge count={data?.warnings_count} className="w-full" offset={[0, 0]}>
              <Row className="w-full flex flex-row flex-no-wrap p-1">
                <AlertOutlined className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('warnings')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
      {Boolean(data?.doctor_edit_recommendations_count) && (
        <Tooltip title={t('edit_request')} className="py-3 md:p-0 border-divider">
          <Badge count={data?.doctor_edit_recommendations_count} className="w-full" offset={[0, 0]}>
            <Row className="w-full flex flex-row flex-no-wrap p-1">
              <TeamOutlined className="text-grayLight text-lg" />
              <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('edit_request')}</Text>
            </Row>
          </Badge>
        </Tooltip>
      )}
      {Boolean(data?.patient_comment_count) && (
        <Tooltip title={t('patient_comment')} className="py-3 md:p-0 border-divider">
          <NavLink to="/comment/patient/list" className="flex">
            <Badge count={data?.patient_comment_count} className="w-full" offset={[0, 0]}>
              <Row className="w-full flex flex-row flex-no-wrap p-1">
                <CommentOutlined className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('patient_comment')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
      {Boolean(data?.strength_and_weakness_answers_count) && (
        <Tooltip title={t('strength_weakness_comments')} className="py-3 md:p-0 border-divider">
          <NavLink
            className="flex"
            to={{
              pathname: '/question/answer_detail/list/',
              search: qs.stringify({
                // is_answered: '1',
                // questions_id: [14],
                type: 'strength_and_weakness',
                reviewed: 0
              })
            }}>
            <Badge
              count={data?.strength_and_weakness_answers_count}
              className="w-full flex flex-row flex-no-wrap p-1"
              offset={[0, 0]}>
              <Row className="w-full">
                <FrownOutlined className="text-grayLight text-lg" />
                <Text className="truncate mx-5 text-center flex-1 md:d-none">{t('strength_weakness_comments')}</Text>
              </Row>
            </Badge>
          </NavLink>
        </Tooltip>
      )}
    </Space>
  );
};
export default HeaderDetail;
