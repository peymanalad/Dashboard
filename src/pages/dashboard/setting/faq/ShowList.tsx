import React, {FC, useState} from 'react';
import {Button, Card, Modal, Space, Tooltip, Typography} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, DiffOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';
import replace from 'lodash/replace';

const {Text} = Typography;

const ShowList: FC = () => {
  const {t} = useTranslation('setting');
  const {hasPermission} = useUser();

  const [content, setContent] = useState<string | null>();

  const deleteRequest = useDelete({
    url: 'faqs/{id}',
    name: 'faqs'
  });

  const onClickShowContent = (detail: string | null) => () => {
    setContent(detail ? trim(replace(detail, /<[^>]+>/g, '')) : '');
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
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: t('group'),
      dataIndex: ['faq_group', 'title'],
      key: 'faq_group',
      align: 'center',
      responsive: ['sm']
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
      align: 'center',
      render: (permissions: simplePermissionProps, faq: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/setting/faq/edit/${faq?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(faq)}
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card
      title={t('faqs')}
      extra={
        hasPermission('faqs.store') && (
          <Link to="/setting/faq/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_faq')}
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
      <CustomTable
        fetch="faqs/paginate"
        dataName="faqs"
        rowClassName={(record: any) => `bg-${record?.status}`}
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
