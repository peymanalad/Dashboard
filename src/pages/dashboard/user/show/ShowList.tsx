import React, {type FC, useRef, type ElementRef} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useDelete, usePost, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Card, Image, Space, Tooltip} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  MailOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
  FileExcelOutlined,
  EyeOutlined
} from '@ant-design/icons';
import {CustomTable, Search} from 'components';
import SearchUsers from 'containers/users/show/SearchUsers';
import {convertUtcTimeToLocal, queryStringToObject, getTempFileUrl, getImageUrl} from 'utils';
import type {simplePermissionProps} from 'types/common';
import {DeedLogoImg} from 'assets';

const UserShowList: FC = () => {
  const {t} = useTranslation('user-show');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const tableRef = useRef<ElementRef<typeof CustomTable>>(null);
  const {hasPermission, isSuperUser} = useUser();
  const location = useLocation();

  const fetchExcel = usePost({
    url: 'services/app/User/GetUsersToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: '/services/app/User/DeleteUser',
    name: 'users',
    titleKey: [['username'], ['name'], ['id']]
  });

  const columns = [
    {
      title: t('profile'),
      dataIndex: 'profilePictureId',
      key: 'profilePictureId',
      className: 'pt-2 pb-0',
      align: 'center',
      render: (imageId: string) =>
        imageId ? (
          <Image
            preview={{
              className: 'custom-operation',
              mask: (
                <div className="w-full h-full bg-black opacity-75 flex flex-center">
                  <EyeOutlined className="text-yellow" />
                </div>
              )
            }}
            width={50}
            height={50}
            src={getImageUrl(imageId)}
            fallback={DeedLogoImg}
          />
        ) : (
          '-'
        )
    },
    {
      title: t('username'),
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      sorter: true
    },
    {
      title: t('mobile'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
      sorter: true
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      sorter: true
    },
    {
      title: t('last_name'),
      dataIndex: 'surname',
      key: 'surname',
      align: 'center',
      sorter: true
    },
    {
      title: t('role'),
      dataIndex: ['roles', 0, 'roleName'],
      key: 'roles',
      align: 'center',
      sorter: false,
      render: (role?: string) => t(role || 'User')
    },
    {
      title: t('active'),
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      responsive: ['sm'],
      sorter: true,
      render: (isActive: boolean) => (
        <Tooltip title={t(isActive ? 'active' : 'inactive')}>
          {isActive ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
          )}
        </Tooltip>
      )
    },
    {
      title: t('email_activate'),
      dataIndex: 'isEmailConfirmed',
      key: 'isEmailConfirmed',
      align: 'center',
      responsive: ['md'],
      sorter: true,
      render: (isActive: boolean) => (
        <Tooltip title={t(isActive ? 'confirm' : 'not_confirm')}>
          {isActive ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
          )}
        </Tooltip>
      )
    },
    {
      title: t('created_at'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      align: 'center',
      responsive: ['md'],
      sorter: true,
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('lastLogin'),
      dataIndex: 'lastLoginAttemptTime',
      key: 'lastLoginAttemptTime',
      align: 'center',
      responsive: ['md'],
      sorter: true,
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, user: any) => (
        <Space size={2}>
          <Tooltip title={t('showOrganizationUsers')}>
            <Link to={`/user/show/${user?.id}/organizations`}>
              <Button type="text" icon={<BankOutlined className="text-red" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('send_message')}>
            <Link to={`/message/friend/${user?.id}`}>
              <Button type="text" icon={<MailOutlined className="text-orange" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('update')}>
            <Link to={`/user/edit/${user?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('profile')}>
            <Link to={`/user/show/${user?.id}`}>
              <Button type="text" icon={<EyeOutlined className="text-orange" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(user, {Id: user?.id})}
              type="text"
              icon={<DeleteOutlined className="text-red" />}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      extra={
        <Space size="small">
          {/*<Button className="ant-btn-success d-text-none md:d-text-unset" icon={<UploadOutlined />}>*/}
          {/*  {t('upload')}*/}
          {/*</Button>*/}
          <Button
            className="ant-btn-success d-text-none md:d-text-unset"
            type="primary"
            icon={<FileExcelOutlined />}
            loading={fetchExcel.isLoading}
            onClick={() => {
              fetchExcel.post({}, queryStringToObject(location.search));
            }}>
            {t('excel')}
          </Button>
          {!hasPermission('users.store') && (
            <Link to="/user/create">
              <Button className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset" icon={<FormOutlined />}>
                {t('add')}
              </Button>
            </Link>
          )}
          <SearchUsers />
        </Space>
      }
      className="my-6"
      title={t('title')}>
      <CustomTable
        fetch="/services/app/User/GetListOfUsers"
        dataName="users"
        columns={columns}
        ref={tableRef}
        hasIndexColumn
        hasOrganization
        selectOrganizationProps={{hasAll: isSuperUser()}}
      />
    </Card>
  );
};

export default UserShowList;
