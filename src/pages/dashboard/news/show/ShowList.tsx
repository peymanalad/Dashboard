import React, {useRef, type ElementRef, type FC} from 'react';
import {Button, Card, Space, Tooltip, Image} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import SearchNews from 'containers/news/news/SearchNews';
import {useDelete, usePost, useUser} from 'hooks';
import {convertTimeToUTC, convertUtcTimeToLocal, getImageUrl, getTempFileUrl, queryStringToObject} from 'utils';
import {DeedLogoImg} from 'assets';
import type {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('news');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission, isSuperUser} = useUser();
  const location = useLocation();

  const fetchExcel = usePost({
    url: 'services/app/Posts/GetPostsToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: '/services/app/Posts/Delete',
    name: 'news',
    titleKey: 'postTitle'
  });

  const columns: any = [
    {
      title: t('image'),
      dataIndex: ['post', 'postFile'],
      key: 'postFile',
      className: 'pt-2 pb-0',
      align: 'center',
      render: (imageId: string) =>
        imageId ? (
          <Image
            preview={{
              className: 'custom-operation',
              mask: (
                <div className="w-full h-full bg-black opacity-75 flex flex-center">
                  <EyeOutlined className="text-yellow" />
                </div>
              )
            }}
            width={50}
            height={50}
            src={getImageUrl(imageId)}
            fallback={DeedLogoImg}
          />
        ) : (
          '-'
        )
    },
    {
      title: t('title'),
      dataIndex: ['post', 'postTitle'],
      key: 'postTitle',
      align: 'center',
      sorter: true
    },
    {
      title: t('group'),
      dataIndex: 'postGroupPostGroupDescription',
      key: 'postGroupPostGroupDescription',
      align: 'center',
      sorter: true
    },
    {
      title: t('context'),
      dataIndex: ['post', 'postCaption'],
      key: 'postCaption',
      align: 'center',
      render: (text: string) => `${text.substring(0, 30)} ...`
    },
    {
      title: t('created_at'),
      dataIndex: ['post', 'creationTime'],
      key: 'creationTime',
      align: 'center',
      responsive: ['md'],
      sorter: true,
      defaultSortOrder: 'descend',
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('updated_at'),
      dataIndex: ['post', 'lastModificationTime'],
      key: 'lastModificationTime',
      align: 'center',
      responsive: ['md'],
      sorter: true,
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('special.title'),
      dataIndex: ['post', 'isSpecial'],
      key: 'isSpecial',
      align: 'center',
      responsive: ['sm'],
      sorter: true,
      render: (isSpecial: boolean) => (
        <Space size={2}>
          <Tooltip title={t(isSpecial ? 'special.true' : 'special.false')}>
            {isSpecial ? (
              <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
            ) : (
              <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
            )}
          </Tooltip>
        </Space>
      )
    },
    {
      title: t('publish.title'),
      dataIndex: ['post', 'isPublished'],
      key: 'isPublished',
      align: 'center',
      responsive: ['sm'],
      sorter: true,
      render: (isSpecial: boolean) => (
        <Space size={2}>
          <Tooltip title={t(isSpecial ? 'special.true' : 'special.false')}>
            {isSpecial ? (
              <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
            ) : (
              <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
            )}
          </Tooltip>
        </Space>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, news: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/news/news/edit/${news.post?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(news.post, {Id: news.post?.id})}
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
      title={t('news')}
      extra={
        <Space size="small">
          <Button
            className="ant-btn-success d-text-none md:d-text-unset"
            type="primary"
            icon={<FileExcelOutlined />}
            loading={fetchExcel.isLoading}
            onClick={() => {
              fetchExcel.post({}, queryStringToObject(location.search));
            }}>
            {t('excel')}
          </Button>
          {!hasPermission('news.store') && (
            <Link to="/news/news/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_news')}
              </Button>
            </Link>
          )}
          <SearchNews />
        </Space>
      }>
      <CustomTable
        fetch="services/app/Posts/GetAll"
        dataName="news"
        query={{Sorting: 'creationTime desc'}}
        columns={columns}
        hasIndexColumn
        hasOrganization
        selectOrganizationProps={{hasAll: isSuperUser()}}
      />
    </Card>
  );
};

export default ShowList;
