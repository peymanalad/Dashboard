import React, {useRef, type ElementRef, type FC} from 'react';
import {Button, Card, Space, Tooltip, Image, Form} from 'antd';
import {EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {useDelete} from 'hooks';
import {convertUtcTimeToLocal, getImageUrl} from 'utils';
import {DeedLogoImg} from 'assets';
import type {simplePermissionProps} from 'types/common';

interface Props {
  id?: string;
}

const ShowOrganizationNews: FC<Props> = ({id}) => {
  const {t} = useTranslation('news');

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

  return (
    <CustomTable
      fetch="services/app/Posts/GetAll"
      dataName={['news', 'organization', id]}
      query={{Sorting: 'creationTime desc', organizationId: id}}
      columns={columns}
      hasIndexColumn
    />
  );
};

export default ShowOrganizationNews;
