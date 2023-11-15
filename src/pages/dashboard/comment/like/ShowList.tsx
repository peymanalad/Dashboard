import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {DeleteOutlined, FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import {CustomTable, Search, SearchButton} from 'components';
import {useDelete, usePost} from 'hooks';
import {convertUtcTimeToLocal, getTempFileUrl, queryStringToObject} from 'utils';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('comments');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const location = useLocation();

  const fetchExcel = usePost({
    url: 'services/app/CommentLikes/GetCommentLikesToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: '/services/app/CommentLikes/Delete',
    name: 'commentLikes',
    titleKey: 'commentCaption'
  });

  const columns: any = [
    {
      title: t('comment'),
      dataIndex: 'commentCommentCaption',
      key: 'commentCommentCaption',
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
      dataIndex: ['commentLike', 'likeTime'],
      key: 'likeTime',
      sorter: true,
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, commentLikes: any) => (
        <Space size={2}>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(commentLikes.commentLike, {Id: commentLikes.commentLike?.id})}
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
      title={t('comment_likes')}
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
      <CustomTable fetch="services/app/CommentLikes/GetAll" dataName="commentLikes" columns={columns} hasOrganization />
    </Card>
  );
};

export default ShowList;
