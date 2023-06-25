import React, {FC, useRef, useState} from 'react';
import {Layout, Button, Drawer, Typography, Space, Row, Avatar, Divider, Popover} from 'antd';
import {CloseOutlined, MenuOutlined, UserOutlined, AlertOutlined, PlusOutlined} from '@ant-design/icons';
import {HeaderDetail} from 'containers';
import {useHistory} from 'react-router-dom';
import {useFetch, usePost, useUser} from 'hooks';
import pick from 'lodash/pick';
import values from 'lodash/values';
import sum from 'lodash/sum';
import {useTranslation} from 'react-i18next';

interface Props {
  allowFetchDashboard: boolean;
  onMenuClick(): void;
}

const {Header} = Layout;
const {Text} = Typography;

const TopHeader: FC<Props> = ({allowFetchDashboard, onMenuClick}) => {
  const {t} = useTranslation('dashboard');
  const history = useHistory();
  const user = useUser();
  const addModalRef = useRef<any>();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const fetchDashboard = useFetch({
    url: '/dashboard',
    name: 'dashboard',
    isGeneral: true,
    staleTime: 10000,
    enabled: allowFetchDashboard
  });

  const logout = usePost({
    url: 'auth/logout',
    method: 'POST',
    showError: false
  });

  const navigateToProfile = () => {
    history.push('/profile');
  };

  const headerData = pick(fetchDashboard?.data, [
    'register_user_count',
    'pending_patient_count',
    'pending_doctor_count',
    'new_recommendations_count',
    'doctor_comment_count',
    'not_confirmed_recommendations_count',
    'warnings_count',
    'doctor_edit_recommendations_count',
    'patient_comment_count',
    'strength_and_weakness_answers_count'
  ]);

  const accounts = (
    <div className="flex flex-col w-full">
      <Divider className="my-2" />
      <Button onClick={() => addModalRef.current.open()} type="primary" icon={<PlusOutlined />} className="w-full">
        {t('add_account')}
      </Button>
    </div>
  );

  const collapseMenu = () => setCollapsed((prevState: boolean) => !prevState);

  return (
    <Header className="w-full px-4 bg-white flex justify-center items-center">
      <Row className="d-flex md:d-none flex-row flex-no-wrap items-center justify-between w-full">
        <Button type="text" onClick={onMenuClick} icon={<MenuOutlined className="text-grayDarker text-lg" />} />
        <Button
          type="text"
          onClick={() => setCollapsed(true)}
          icon={
            <AlertOutlined className={`text-lg ${sum(values(headerData)) > 0 ? 'text-danger' : 'text-grayDarker '}`} />
          }
        />
      </Row>
      <Row className="d-none md:d-flex flex-row flex-no-wrap items-center justify-between w-full">
        <HeaderDetail data={headerData} />
        {user.hasPermission('users.switch') || user.is_logged_in ? (
          <Popover content={accounts} title={t('your_accounts')} placement="bottomRight">
            <Button className="cursor-pointer items-center h-full border-0 bg-transparent" onClick={navigateToProfile}>
              <Space>
                <Avatar size={40} icon={<UserOutlined />} src={user?.getInfo()?.avatar} />
                <Text className="text-sm" strong>
                  {user?.getInfo()?.full_name}
                </Text>
              </Space>
            </Button>
          </Popover>
        ) : (
          <Button className="cursor-pointer bg-transparent items-center h-full border-0" onClick={navigateToProfile}>
            <Space>
              <Avatar size={40} icon={<UserOutlined />} src={user?.getInfo()?.avatar} />
              <Text className="text-sm" strong>
                {user?.getInfo()?.full_name}
              </Text>
            </Space>
          </Button>
        )}
      </Row>
      <Drawer
        title={
          <Row className="flex flex-row justify-between items-center w-full h-full flex px-2 py-3">
            <Button
              className="cursor-pointer border-0"
              onClick={() => {
                history.push('/profile');
                setCollapsed(false);
              }}>
              <Space className="flex h-full">
                <Avatar size={30} icon={<UserOutlined />} src={user?.getInfo()?.avatar} />
                <Text className="text-sm" strong>
                  {user?.getInfo()?.full_name}
                </Text>
              </Space>
            </Button>
            <Button type="text" onClick={collapseMenu} icon={<CloseOutlined className="text-grayDarker" />} />
          </Row>
        }
        closable={false}
        width={350}
        contentWrapperStyle={{maxWidth: '100vw'}}
        headerStyle={{padding: 0, paddingTop: '0.5rem', width: '100%'}}
        bodyStyle={{paddingRight: 0, paddingLeft: 0}}
        placement="left"
        onClose={collapseMenu}
        visible={collapsed}>
        <HeaderDetail data={headerData} />
      </Drawer>
    </Header>
  );
};
export default TopHeader;
