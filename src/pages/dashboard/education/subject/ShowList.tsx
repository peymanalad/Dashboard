import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, useUser} from 'hooks';

const ShowList: FC = () => {
  const {t} = useTranslation('subject');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/subjects/{id}',
    name: 'subjects'
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
      title: `${t('title')}`,
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: `${t('actions')}`,
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: any, item: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/education/subject/edit/${item.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(item)}
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
      title={t('subject')}
      extra={
        <Space size="small">
          {hasPermission('subjects.store') && (
            <Link to="/education/subject/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_subject')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable fetch="subjects/paginate" dataName="subjects" columns={columns} />
    </Card>
  );
};

export default ShowList;
