import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {DeleteOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {CustomTable, Search} from 'components';
import {useDelete} from 'hooks';
import {convertUtcTimeToLocal} from 'utils';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('comments');
  const searchRef = useRef<ElementRef<typeof Search>>(null);

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
      align: 'center'
    },
    {
      title: t('user'),
      dataIndex: 'userName',
      key: 'userName',
      align: 'center'
    },
    {
      title: t('created_at'),
      dataIndex: ['commentLikes', 'likeTime'],
      key: 'created_at',
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
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} name="OrganizationNameFilter" />
      <CustomTable fetch="services/app/CommentLikes/GetAll" dataName="commentLikes" columns={columns} />
    </Card>
  );
};

export default ShowList;
