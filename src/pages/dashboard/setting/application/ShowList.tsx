import React, {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {Button, Card, Modal, Space, Tooltip, Typography} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  DeleteOutlined,
  AndroidOutlined,
  WindowsOutlined,
  AppleOutlined,
  DiffOutlined
} from '@ant-design/icons';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import {RequiredIcon} from 'assets';
import isEmpty from 'lodash/isEmpty';
import {simplePermissionProps} from 'types/common';

const {Text} = Typography;

const ShowList: FC = () => {
  const {t} = useTranslation('setting');
  const [content, setContent] = useState<string | undefined>();
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/versions/{id}',
    name: 'versions'
  });

  const onClickShowContent = (detail: string | null) => () => {
    setContent(detail || '');
  };

  const columns: any = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: `${t('type')}`,
      dataIndex: 'type',
      key: 'type',
      align: 'center'
    },
    {
      title: `${t('os')}`,
      dataIndex: 'os',
      key: 'os',
      align: 'center',
      render: (value: 'android' | 'ios' | 'windows') => (
        <Tooltip title={t(value)}>
          {value === 'android' && <AndroidOutlined style={{color: '#8FBC46', fontSize: 25}} />}
          {value === 'ios' && <AppleOutlined style={{color: '#A3ABB2', fontSize: 25}} />}
          {value === 'windows' && <WindowsOutlined style={{color: '#00A8E8', fontSize: 25}} />}
        </Tooltip>
      )
    },
    {
      title: t('version'),
      dataIndex: 'version',
      key: 'version',
      align: 'center'
    },
    {
      title: t('specifications'),
      dataIndex: 'required',
      key: 'required',
      align: 'center',
      responsive: ['sm'],
      render: (value: any, version: any) => (
        <Space size={2}>
          {value === 1 && (
            <Tooltip title={t('required')}>
              <RequiredIcon style={{fontSize: 16}} />
            </Tooltip>
          )}
          {version?.change_log && version?.change_log?.length && (
            <Tooltip title={t('changes')}>
              <Button
                type="text"
                icon={<DiffOutlined style={{color: '#625772'}} />}
                onClick={onClickShowContent(version?.change_log)}
              />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, version: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/setting/application/edit/${version.id}`}>
              <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(version)}
              type="text"
              icon={<DeleteOutlined style={{color: 'red'}} />}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Card
      title={t('title')}
      extra={
        hasPermission('versions.store') && (
          <Link to="/setting/application/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_application')}
            </Button>
          </Link>
        )
      }>
      <Modal
        title={t('changes')}
        visible={!isEmpty(content)}
        onCancel={() => {
          setContent(undefined);
        }}
        footer={null}>
        <Text type="secondary">{content}</Text>
      </Modal>
      <CustomTable fetch="versions/paginate" dataName="versions" columns={columns} />
    </Card>
  );
};

export default ShowList;
