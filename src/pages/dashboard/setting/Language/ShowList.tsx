import React, {FC, useRef} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('setting');
  const tableRef: any = useRef<any | null>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: 'languages/{id}',
    name: 'faqs'
  });

  const columns: any = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: t('direction'),
      dataIndex: 'direction',
      key: 'direction',
      align: 'center',
      render: (value: string) => t(value)
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, language: any) => (
        <Space size={2}>
          {permissions.update && (
            <Tooltip title={t('update')}>
              <Link to={`/setting/language/edit/${language?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(language)}
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
      className="my-6"
      title={t('language')}
      extra={
        hasPermission('languages.store') && (
          <Link to="/setting/language/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_language')}
            </Button>
          </Link>
        )
      }>
      <CustomTable ref={tableRef} fetch="languages/paginate" dataName="languages" columns={columns} />
    </Card>
  );
};

export default ShowList;
