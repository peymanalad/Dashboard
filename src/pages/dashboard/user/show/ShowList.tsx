import React, {useState, FC, useRef, ElementRef} from 'react';
import {Link} from 'react-router-dom';
import {useDelete, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Card, Space, Tooltip, Modal, Typography} from 'antd';
import {FormOutlined, FilterOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {SearchUsers} from 'containers';
import isNil from 'lodash/isNil';
import {simplePermissionProps} from 'types/common';

const {Text} = Typography;

const UserShowList: FC = () => {
  const {t} = useTranslation('user-show');
  const searchRef = useRef<ElementRef<typeof SearchUsers>>(null);
  const tableRef = useRef<ElementRef<typeof CustomTable>>(null);
  const {hasPermission} = useUser();
  const [note, setNote] = useState<string | undefined>(undefined);

  const deleteRequest = useDelete({
    url: 'users/{id}',
    name: 'users',
    titleKey: [['user', 'full_name'], ['user', 'username'], ['user', 'name'], ['id']]
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('username'),
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
      render: (permissions: simplePermissionProps, organizationGroup: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/organization/group/edit/${organizationGroup.organizationGroup?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() =>
                deleteRequest.show(organizationGroup.organizationGroup, {Id: organizationGroup.organizationGroup?.id})
              }
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
      <Modal
        title={t('note')}
        visible={!isNil(note)}
        onCancel={() => {
          setNote(undefined);
        }}
        footer={null}>
        <Text>{note}</Text>
      </Modal>
      <SearchUsers ref={searchRef} />
      <CustomTable fetch="services/app/GroupMembers/GetAll" dataName="users" columns={columns} ref={tableRef} />
    </Card>
  );
};

export default UserShowList;
