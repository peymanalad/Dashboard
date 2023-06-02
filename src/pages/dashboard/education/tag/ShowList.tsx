import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('tag');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/tags/{id}',
    name: 'tags'
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
      title: t('specifications'),
      dataIndex: 'is_confirm',
      key: 'is_confirm',
      align: 'center',
      responsive: ['sm'],
      render: (value: 1 | 0) => (
        <Tooltip title={t(value === 1 ? 'confirm.true' : 'confirm.false')}>
          {value === 1 ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
          )}
        </Tooltip>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, tag: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/education/tag/edit/${tag.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(tag)}
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      title={t('title')}
      extra={
        <Space size="small">
          {hasPermission('tags.store') && (
            <Link to="/education/tag/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_tag')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable
        fetch="tags/paginate"
        dataName="tags"
        rowClassName={(record) => `bg-${record?.is_confirm === 1 ? 'active' : 'inactive'}`}
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
