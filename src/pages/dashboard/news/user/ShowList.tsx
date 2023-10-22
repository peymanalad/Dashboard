import React, {FC, useRef, ElementRef} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useDelete, usePost, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, FilterOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined} from '@ant-design/icons';
import {CustomTable, Search} from 'components';
import {queryStringToObject} from 'utils/common';
import {getTempFileUrl} from 'utils/file';
import type {simplePermissionProps} from 'types/common';

const UserMemberShowList: FC = () => {
  const {t} = useTranslation('news');
  const user = useUser();
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const tableRef = useRef<ElementRef<typeof CustomTable>>(null);
  const location = useLocation();

  const deleteRequest = useDelete({
    url: 'services/app/GroupMembers/Delete',
    name: 'groupMembers',
    titleKey: 'id'
  });

  const fetchExcel = usePost({
    url: 'services/app/GroupMembers/GetGroupMembersToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const columns = [
    {
      title: t('firstName'),
      dataIndex: 'firstName',
      key: 'firstName',
      align: 'center'
    },
    {
      title: t('lastName'),
      dataIndex: 'lastName',
      key: 'lastName',
      align: 'center'
    },
    {
      title: t('userName'),
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      sorter: true
    },
    {
      title: t('organization_position'),
      dataIndex: ['groupMember', 'memberPos'],
      key: 'memberPos',
      align: 'center',
      sorter: true
    },
    {
      title: t('organization_situation'),
      dataIndex: ['groupMember', 'memberPosition'],
      key: 'memberPosition',
      align: 'center',
      sorter: true
    },
    {
      title: t('organization'),
      dataIndex: 'organizationGroupGroupName',
      key: 'organizationGroupGroupName',
      align: 'center',
      sorter: true
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, groupMember: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/news/member/edit/${groupMember.groupMember?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(groupMember.groupMember, {Id: groupMember.groupMember?.id})}
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
          {user?.isSuperUser() && (
            <Link to="/news/member/create">
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
      title={t('news_member')}>
      <Search ref={searchRef} />
      <CustomTable
        fetch="services/app/GroupMembers/GetAll"
        dataName="groupMembers"
        columns={columns}
        ref={tableRef}
        hasIndexColumn
      />
    </Card>
  );
};

export default UserMemberShowList;
