import React, {FC} from 'react';
import {Button, Image, Space, Tooltip} from 'antd';
import {EditOutlined, EyeOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {convertUtcTimeToLocal, getImageUrl} from 'utils';
import type {simplePermissionProps} from 'types/common';
import {DeedLogoImg} from 'assets';

interface Props {
  id?: string;
}

const ShowUserNews: FC<Props> = ({id}) => {
  const {t} = useTranslation('news');

  const columns: any = [
    {
      title: t('picture'),
      dataIndex: 'postFile',
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
      title: t('the_news'),
      dataIndex: 'postTitle',
      key: 'postTitle',
      sorter: true,
      align: 'center'
    },
    {
      title: t('created_at'),
      dataIndex: 'postTime',
      key: 'postTime',
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
            <Link to={`/news/news/edit/${postLike.postId}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <CustomTable
      fetch="services/app/User/GetUserPosts"
      dataName={['news', 'user', id]}
      columns={columns}
      query={{UserId: id}}
    />
  );
};

export default ShowUserNews;
