import React, {FC, useRef, ElementRef} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useDelete, usePost, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Card, Space, Tooltip} from 'antd';
import {
  FormOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import {CustomTable} from 'components';
import {SearchUsers} from 'containers';
import {convertUtcTimeToLocal, queryStringToObject, getTempFileUrl} from 'utils';
import {simplePermissionProps} from 'types/common';

const UserShowList: FC = () => {
  const {t} = useTranslation('user-show');
  const searchRef = useRef<ElementRef<typeof SearchUsers>>(null);
  const tableRef = useRef<ElementRef<typeof CustomTable>>(null);
  const {hasPermission} = useUser();
  const location = useLocation();

  const fetchExcel = usePost({
    url: 'services/app/User/GetUsersToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: 'users/{id}',
    name: 'users',
    titleKey: [['username'], ['name'], ['id']]
  });

  const columns = [
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
      key: 'mobile',
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
      sorter: true
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
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, user: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/user/edit/${user?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
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
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }
      className="my-6"
      title={t('title')}>
      <SearchUsers ref={searchRef} />
      <CustomTable
        fetch="/services/app/User/GetListOfUsers"
        dataName="users"
        columns={columns}
        ref={tableRef}
        hasIndexColumn
      />
    </Card>
  );
};

export default UserShowList;
