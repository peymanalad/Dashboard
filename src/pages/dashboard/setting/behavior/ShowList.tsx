import React, {FC, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDelete, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {Button, Card, Modal, Space, Tooltip, Typography} from 'antd';
import {FormOutlined, DeleteOutlined, EditOutlined, DiffOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {simplePermissionProps} from 'types/common';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';

const {Text} = Typography;

const ShowList: FC = () => {
  const {t} = useTranslation('setting');
  const {hasPermission} = useUser();

  const [content, setContent] = useState<string | null>();

  const deleteRequest = useDelete({
    url: '/behaviors/{id}',
    name: 'behaviors'
  });

  const onClickShowContent = (detail: string | null) => () => {
    setContent(detail || '');
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      align: 'center'
    },
    {
      title: t('specifications'),
      dataIndex: 'description',
      key: 'specifications',
      align: 'center',
      responsive: ['sm'],
      render: (description: string | null) =>
        !isEmpty(description) && (
          <Tooltip title={t('description')}>
            <Button
              type="text"
              icon={<DiffOutlined style={{color: '#625772'}} />}
              onClick={onClickShowContent(description)}
            />
          </Tooltip>
        )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: simplePermissionProps, behavior: any) => (
        <Space size={2}>
          {permissions.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/setting/behavior/edit/${behavior?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
                onClick={() => deleteRequest.show(behavior)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card
      title={t('behavior')}
      extra={
        hasPermission('behaviors.store') && (
          <Link to="/setting/behavior/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_behavior')}
            </Button>
          </Link>
        )
      }>
      <Modal
        title={t('description')}
        visible={!isNil(content)}
        onCancel={() => {
          setContent(null);
        }}
        footer={null}>
        <Text type="secondary">{content}</Text>
      </Modal>
      <CustomTable fetch="behaviors/paginate" dataName="behaviors" columns={columns} />
    </Card>
  );
};

export default ShowList;
