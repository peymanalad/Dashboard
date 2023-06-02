import React, {FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, SortAscendingOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import {permissionAdvancedProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('setting');
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/faq_groups/{id}',
    name: 'faq_groups'
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
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: permissionAdvancedProps, group: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/setting/faqGroup/edit/${group?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(group)}
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
          {permissions?.priority && (
            <Tooltip title={t('sort_faq')}>
              <Link to={`/setting/faqGroup/sort/${group.id}`}>
                <Button type="text" icon={<SortAscendingOutlined style={{color: '#4CAF50'}} />} />
              </Link>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card
      title={t('faqGroup')}
      extra={
        hasPermission('faq_groups.store') && (
          <Link to="/setting/faqGroup/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
              {t('add_faqGroup')}
            </Button>
          </Link>
        )
      }>
      <CustomTable
        fetch="faq_groups/paginate"
        dataName="faqGroups"
        rowClassName={(group: any) => `bg-${group?.status}`}
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
