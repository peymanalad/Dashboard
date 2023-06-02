import React, {FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {
  DeleteOutlined,
  BookOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
  EditOutlined
} from '@ant-design/icons';
import {useDelete} from 'hooks';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {convertUtcTimeToLocal} from 'utils';

const DoctorComments: FC = () => {
  const {t} = useTranslation('comments');

  const deleteRequest = useDelete({
    url: '/comments/{id}',
    name: ['comments', 'doctors']
  });

  const columns = [
    {
      title: t('recommendation_title'),
      dataIndex: ['recommendation', 'title'],
      key: 'title',
      align: 'center'
    },
    {
      title: t('disease'),
      dataIndex: ['recommendation', 'disease', 'name'],
      key: 'disease',
      align: 'center'
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      responsive: ['sm'],
      render: (user: any) => user?.full_name || user?.username
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (date?: string) => (date ? convertUtcTimeToLocal(date) : '-')
    },
    {
      title: t('specifications'),
      dataIndex: 'read_at',
      key: 'read_at',
      align: 'center',
      responsive: ['sm'],
      render: (read_at: string) => (
        <Space size={2}>
          {read_at ? (
            <Tooltip title={t('seen')}>
              <Button type="text" icon={<EyeOutlined style={{color: '#4CAF50', fontSize: 16}} />} />
            </Tooltip>
          ) : (
            <Tooltip title={t('not_seen')}>
              <Button type="text" icon={<EyeInvisibleOutlined style={{color: '#F44336', fontSize: 16}} />} />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: any, item: any) => (
        <Space size={2}>
          {permissions?.recommendation && (
            <Tooltip title={t('show.recommendation')}>
              <Link to={`/education/recommendation/edit/${item?.recommendation?.id}`}>
                <Button type="text" icon={<BookOutlined style={{color: '#E91E63'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.user && (
            <Tooltip title={t('show.user')}>
              <Link to={`/user/show/${item?.user?.id}`}>
                <Button type="text" icon={<UserOutlined style={{color: '#ff7f50'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                onClick={() => deleteRequest.show(item)}
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
          {permissions?.view && (
            <Tooltip title={t('show.reply')}>
              <Link to={`/comment/doctor/edit/${item?.recommendation?.id}/${item?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card title={t('doctors_comments')}>
      <CustomTable
        fetch="comments/doctors/paginate"
        dataName={['comments', 'doctors']}
        rowClassName={(record) => `bg-${record?.read_at ? 'active' : 'inactive'}`}
        columns={columns}
      />
    </Card>
  );
};

export default DoctorComments;
