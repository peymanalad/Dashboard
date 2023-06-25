import React, {FC, useRef, ElementRef} from 'react';
import {Link} from 'react-router-dom';
import {useDelete, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, FilterOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {SearchUsers} from 'containers';
import {simplePermissionProps} from 'types/common';

const UserMemberShowList: FC = () => {
  const {t} = useTranslation('news');
  const searchRef = useRef<ElementRef<typeof SearchUsers>>(null);
  const tableRef = useRef<ElementRef<typeof CustomTable>>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: 'users/{id}',
    name: 'users',
    titleKey: 'id'
  });

  const columns = [
    {
      title: t('name'),
      dataIndex: 'userName',
      key: 'userName',
      align: 'center'
    },
    {
      title: t('position'),
      dataIndex: ['groupMember', 'memberPosition'],
      key: 'memberPosition',
      align: 'center'
    },
    {
      title: t('group'),
      dataIndex: 'organizationGroupGroupName',
      key: 'organizationGroupGroupName',
      align: 'center'
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
          {!hasPermission('users.store') && (
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
      <SearchUsers ref={searchRef} />
      <CustomTable fetch="services/app/GroupMembers/GetAll" dataName="groupMembers" columns={columns} ref={tableRef} hasIndexColumn />
    </Card>
  );
};

export default UserMemberShowList;
