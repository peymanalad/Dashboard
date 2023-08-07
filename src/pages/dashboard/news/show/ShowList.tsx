import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip, Image} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, usePost, useUser} from 'hooks';
import {simplePermissionProps} from 'types/common';
import {convertUtcTimeToLocal, getImageUrl, getTempFileUrl, queryStringToObject} from 'utils';

const ShowList: FC = () => {
  const {t} = useTranslation('news');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();
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
      key: 'image',
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
          />
        ) : (
          '-'
        )
    },
    {
      title: t('title'),
      dataIndex: ['post', 'postTitle'],
      key: 'name',
      align: 'center'
    },
    {
      title: t('group'),
      dataIndex: 'postGroupPostGroupDescription',
      key: 'group',
      align: 'center'
    },
    {
      title: t('position_user'),
      dataIndex: 'groupMemberMemberPosition',
      key: 'position',
      align: 'center'
    },
    {
      title: t('context'),
      dataIndex: ['post', 'postCaption'],
      key: 'name',
      align: 'center',
      render: (text: string) => `${text.substring(0, 30)} ...`
    },
    {
      title: t('created_at'),
      dataIndex: ['post', 'creationTime'],
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('updated_at'),
      dataIndex: ['post', 'lastModificationTIme'],
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('special.title'),
      dataIndex: ['post', 'isSpecial'],
      key: 'isSpecial',
      align: 'center',
      responsive: ['sm'],
      render: (isSpecial: boolean) => (
        <Tooltip title={t(isSpecial ? 'special.true' : 'special.false')}>
          {isSpecial ? (
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
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} name="NewsNameFilter" />
      <CustomTable fetch="services/app/Posts/GetAll" dataName="news" columns={columns} hasIndexColumn />
    </Card>
  );
};

export default ShowList;
