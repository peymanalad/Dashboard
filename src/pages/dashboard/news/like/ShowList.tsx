import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {DeleteOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {CustomTable, Search} from 'components';
import {useDelete} from 'hooks';
import {convertUtcTimeToLocal} from 'utils';
import {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('news');
  const searchRef = useRef<ElementRef<typeof Search>>(null);

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
      dataIndex: ['postLike', 'likeTime'],
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
      render: (permissions: simplePermissionProps, postLike: any) => (
        <Space size={2}>
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
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <Search ref={searchRef} name="OrganizationNameFilter" />
      <CustomTable fetch="services/app/PostLikes/GetAll" dataName="newsLikes" columns={columns} />
    </Card>
  );
};

export default ShowList;
