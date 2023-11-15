import React, {FC, useRef, ElementRef} from 'react';
import {Link} from 'react-router-dom';
import {useDelete} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Space, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import type {simplePermissionProps} from 'types/common';

interface Props {
  id?: string;
}

const ShowOrganizationUsers: FC<Props> = ({id}) => {
  const {t} = useTranslation('news');
  const tableRef = useRef<ElementRef<typeof CustomTable>>(null);

  const deleteRequest = useDelete({
    url: 'services/app/GroupMembers/Delete',
    name: 'groupMembers',
    titleKey: 'id'
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

  return (
    <CustomTable
      fetch="services/app/GroupMembers/GetAll"
      dataName={['organization', 'groupMembers', id]}
      columns={columns}
      ref={tableRef}
      query={{organizationId: id}}
    />
  );
};

export default ShowOrganizationUsers;
