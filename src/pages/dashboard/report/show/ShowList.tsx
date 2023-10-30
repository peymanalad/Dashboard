import React, {useRef, type ElementRef, type FC, useState} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, useUser} from 'hooks';
import type {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('report');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const user = useUser();
  const isSuperUser: boolean = user?.isSuperUser();

  const deleteRequest = useDelete({
    url: '/services/app/Reports/Delete',
    name: 'reports',
    titleKey: 'reportDescription'
  });

  const columns: any = [
    {
      title: t('title'),
      dataIndex: 'reportDescription',
      key: 'reportDescription',
      align: 'center',
      sorter: true
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, report: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/report/reports/edit/${report.reportId}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          {/*<Tooltip title={t('do_delete')}>*/}
          {/*  <Button*/}
          {/*    onClick={() => deleteRequest.show(report, {Id: report.reportId})}*/}
          {/*    type="text"*/}
          {/*    icon={<DeleteOutlined className="text-red" />}*/}
          {/*  />*/}
          {/*</Tooltip>*/}
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      title={t('reports')}
      extra={
        <Space size="small">
          {/*{!hasPermission('news.store') && (*/}
          {/*  <Link to="/news/news/create">*/}
          {/*    <Button*/}
          {/*      type="primary"*/}
          {/*      className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"*/}
          {/*      icon={<FormOutlined />}>*/}
          {/*      {t('add_news')}*/}
          {/*    </Button>*/}
          {/*  </Link>*/}
          {/*)}*/}
          {/*<Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>*/}
          {/*  {t('filter')}*/}
          {/*</Button>*/}
        </Space>
      }>
      <Search ref={searchRef} />
      <CustomTable
        fetch={`${process.env.REACT_APP_BASE_URL}/Report/GetListOfReports`}
        path={[]}
        dataName="reports"
        columns={columns}
        hasIndexColumn
        hasOrganization={!isSuperUser}
      />
    </Card>
  );
};

export default ShowList;
