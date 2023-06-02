import React, {useMemo} from 'react';
import {Menu, Dropdown, Button} from 'antd';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  LineChartOutlined,
  MailOutlined,
  MessageOutlined,
  MoreOutlined,
  ReconciliationOutlined,
  SafetyCertificateOutlined,
  WalletOutlined
} from '@ant-design/icons';
import map from 'lodash/map';
import entries from 'lodash/entries';
import filter from 'lodash/filter';
import {menuItem} from 'types/general';
import qs from 'qs';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {UserActionPermissions, userProps} from 'types/user';
import {getLangSearchParam} from 'utils';
import {useDelete, usePost} from 'hooks';

export interface props {
  user: userProps;
  permissions: UserActionPermissions;
}

const UserDropDownMenu = ({user, permissions}: props) => {
  const history = useHistory();
  const {t} = useTranslation('user-show');

  const deleteRequest = useDelete({
    url: 'users/{id}',
    name: 'users',
    titleKey: [['user', 'full_name'], ['user', 'username'], ['user', 'name'], ['id']]
  });

  const sendSMS = usePost({
    url: '/users/{id}/send_sms',
    method: 'POST'
  });

  const getIcon = (key: string): React.ReactNode => {
    switch (key) {
      case 'delete':
        return <DeleteOutlined />;
      case 'orders.store':
        return <WalletOutlined />;
      case 'orders.view':
        return <ReconciliationOutlined />;
      case 'permissions.view':
        return <SafetyCertificateOutlined />;
      case 'support_messages.view':
        return <MessageOutlined />;
      case 'visits.store':
        return <FileAddOutlined />;
      case 'visits.view':
        return <FileSearchOutlined />;
      case 'send_sms':
        return <MailOutlined />;
      case 'doctor_report':
        return <LineChartOutlined />;
      default:
        return <CloseCircleOutlined />;
    }
  };

  const navigateToValue = (name: string, user: userProps) => {
    switch (name) {
      case 'delete':
        deleteRequest.show(user);
        break;
      case 'doctor_report':
        history.push(getLangSearchParam(`/user/DrReport/${user?.id}`));
        break;
      case 'orders.store':
        //@ts-ignore
        history.push(getLangSearchParam(`/order/factor/create?${qs.stringify({user: {id: user.id, ...user?.user}})}`));
        break;
      case 'orders.view':
        history.push(getLangSearchParam(`/order/factor/list?user_id=${user?.id}`));
        break;
      case 'permissions.view':
        history.push(getLangSearchParam(`/user/permission/${user?.id}`));
        break;
      case 'support_messages.view':
        history.push(getLangSearchParam(`/message/support/chat/${user?.id}`));
        break;
      case 'visits.store':
        //@ts-ignore
        history.push(getLangSearchParam(`/visit/create?${qs.stringify({user: {id: user.id, ...user?.user}})}`));
        break;
      case 'visits.view':
        history.push(getLangSearchParam(`/visits/list?user_id=${user?.id}`));
        break;
      case 'send_sms':
        sendSMS.post({}, {}, {id: user?.id});
        break;
      default:
        return null;
    }
  };

  const items = useMemo(
    (): menuItem[] =>
      map(
        filter(
          entries(permissions),
          ([key, value]) => value && key !== 'update' && key !== 'view' && key !== 'whatsapp.view'
        ),
        ([key]: any) => ({
          name: t(key),
          onClick: () => {
            navigateToValue(key, user);
          },
          icon: getIcon(key),
          danger: key === 'delete'
        })
      ),
    [user, permissions]
  );

  const menu = (
    <Menu>
      {map(items, (item: menuItem, index: number) => (
        <Menu.Item
          key={index}
          icon={item?.icon}
          onClick={item?.onClick}
          danger={item?.danger}
          disabled={item?.disabled}>
          {item?.name}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <Button type="text" style={{color: '#aeb5b8'}} icon={<MoreOutlined />} />
    </Dropdown>
  );
};
export default UserDropDownMenu;
