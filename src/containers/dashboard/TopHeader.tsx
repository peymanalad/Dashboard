import React, {FC, useState} from 'react';
import {Layout, Button, Drawer, Typography, Space, Row, Avatar} from 'antd';
import {CloseOutlined, MenuOutlined, UserOutlined, AlertOutlined} from '@ant-design/icons';
import {HeaderDetail} from 'containers';
import {useHistory} from 'react-router-dom';
import {useFetch, useUser} from 'hooks';
import pick from 'lodash/pick';
import values from 'lodash/values';
import sum from 'lodash/sum';
import {getImageUrl} from 'utils/image';

interface Props {
  allowFetchDashboard: boolean;
  onMenuClick(): void;
}

const {Header} = Layout;
const {Text} = Typography;

const TopHeader: FC<Props> = ({allowFetchDashboard, onMenuClick}) => {
  const history = useHistory();
  const user = useUser();
  const userInfo = user?.getInfo();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const fetchDashboard = useFetch({
    url: '/dashboard',
    name: 'dashboard',
    isGeneral: true,
    staleTime: 10000,
    enabled: false
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
        <Button className="cursor-pointer bg-transparent items-center h-full border-0" onClick={navigateToProfile}>
          <Space>
            <Avatar size={40} icon={<UserOutlined />} src={getImageUrl(userInfo?.profilePictureId)} />
            <Text className="text-sm" strong>
              {`${userInfo?.name || ''} ${userInfo?.surname || ''}`}
            </Text>
          </Space>
        </Button>
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
                <Avatar size={30} icon={<UserOutlined />} src={getImageUrl(userInfo?.profilePictureId)} />
                <Text className="text-sm" strong>
                  {`${userInfo?.name || ''} ${userInfo?.surname || ''}`}
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
