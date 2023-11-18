import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {DeleteOutlined, EyeOutlined, FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, Search, SearchButton} from 'components';
import {useDelete, usePost, useUser} from 'hooks';
import {convertUtcTimeToLocal, getTempFileUrl, queryStringToObject} from 'utils';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('news');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const location = useLocation();
  const {isSuperUser} = useUser();

  const fetchExcel = usePost({
    url: 'services/app/PostLikes/GetPostLikesToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: '/services/app/PostLikes/Delete',
    name: 'newsLikes',
    titleKey: 'postPostTitle'
  });

  const columns: any = [
    {
      title: t('the_news'),
      dataIndex: 'postPostTitle',
      key: 'postPostTitle',
      sorter: true,
      align: 'center'
    },
    {
      title: t('user'),
      dataIndex: 'userName',
      key: 'userName',
      sorter: true,
      align: 'center'
    },
    {
      title: t('created_at'),
      dataIndex: ['postLike', 'likeTime'],
      key: 'likeTime',
      align: 'center',
      sorter: true,
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, postLike: any) => (
        <Space size={2}>
          <Tooltip title={t('newsProfile')}>
            <Link to={`/news/news/show/${postLike?.postLike?.postId}`}>
              <Button type="text" icon={<EyeOutlined className="text-orange" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(postLike, {Id: postLike.postLike?.id})}
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
      title={t('news_likes')}
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
          <SearchButton />
        </Space>
      }>
      <CustomTable
        fetch="services/app/PostLikes/GetAll"
        dataName="newsLikes"
        columns={columns}
        hasOrganization
        selectOrganizationProps={{hasAll: isSuperUser()}}
      />
    </Card>
  );
};

export default ShowList;
