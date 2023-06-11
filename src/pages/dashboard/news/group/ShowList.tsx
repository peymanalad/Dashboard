import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('news');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/services/app/PostGroups/Delete',
    name: 'newsGroups',
    titleKey: 'newsName'
  });

  const columns: any = [
    {
      title: '#',
      dataIndex: ['postGroup', 'id'],
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('name'),
      dataIndex: ['postGroup', 'postGroupDescription'],
      key: 'name',
      align: 'center'
    },
    {
      title: t('group'),
      dataIndex: 'organizationGroupGroupName',
      key: 'group',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, newsGroup: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/news/group/edit/${newsGroup.postGroup?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(newsGroup.postGroup, {Id: newsGroup.postGroup?.id})}
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
      title={t('news_groups')}
      extra={
        <Space size="small">
          {!hasPermission('news.store') && (
            <Link to="/news/group/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_news_group')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} name="NewsNameFilter" />
      <CustomTable fetch="services/app/PostGroups/GetAll" dataName="postGroups" columns={columns} />
    </Card>
  );
};

export default ShowList;
