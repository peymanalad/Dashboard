import React, {ElementRef, FC, useRef} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, FilterOutlined, PictureOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('reference');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof Search>>(null);

  const deleteRequest = useDelete({
    url: '/references/{id}',
    name: 'references'
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
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: t('Specifications'),
      dataIndex: 'picture',
      key: 'picture',
      align: 'center',
      responsive: ['sm'],
      render: (permissions: any, reference: any) => (
        <Space size={2}>
          {reference?.picture_url && (
            <Tooltip title={t('has_image')}>
              <Button type="text" icon={<PictureOutlined style={{color: '#e95e1e'}} />} />
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
      render: (permissions: simplePermissionProps, reference: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/education/reference/edit/${reference.id}`}>
              <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(reference)}
              type="text"
              icon={<DeleteOutlined style={{color: 'red'}} />}
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
      title={t('reference')}
      extra={
        <Space size="small">
          {hasPermission('references.store') && (
            <Link to="/education/reference/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_reference')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable fetch="references/paginate" dataName="references" columns={columns} />
    </Card>
  );
};

export default ShowList;
