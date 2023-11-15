import React, {useRef, ElementRef, FC} from 'react';
import {Button, Space, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete} from 'hooks';
import {convertUtcTimeToLocal} from 'utils';
import type {simplePermissionProps} from 'types/common';

interface Props {
  id?: string;
}

const ShowUserLikedNews: FC<Props> = ({id}) => {
  const {t} = useTranslation('news');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const location = useLocation();

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
          <Tooltip title={t('update')}>
            <Link to={`/news/news/edit/${postLike.postPostId}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
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

  return <CustomTable fetch="services/app/PostLikes/GetAll" dataName={['newsLikes', id]} columns={columns} />;
};

export default ShowUserLikedNews;
