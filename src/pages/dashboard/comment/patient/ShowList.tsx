import React, {ElementRef, useRef} from 'react';
import {Card, Tooltip, Space, Button} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import {convertUtcTimeToLocal} from 'utils';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {SearchPatientsComment} from 'containers';

const ShowList = () => {
  const {t} = useTranslation('comments');
  const searchRef = useRef<ElementRef<typeof SearchPatientsComment>>(null);

  const columns: any = [
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
      title: `${t('specifications')}`,
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
          {permissions?.view && (
            <Tooltip title={t('show.reply')}>
              <Link to={`/comment/patient/edit/${item?.recommendation?.id}/${item?.id}`}>
                <Button type="text" style={{color: '#035aa6'}} icon={<EditOutlined />} />
              </Link>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <>
      <Card
        className="my-6"
        title={t('patients_comments')}
        extra={
          <Space size="small">
            <Button
              type="primary"
              className="d-text-none md:d-text-unset"
              icon={<FilterOutlined />}
              onClick={showSearch}>
              {t('filter')}
            </Button>
          </Space>
        }>
        <CustomTable
          fetch="comments/patients/paginate"
          dataName="patientComments"
          rowClassName={(record) => `bg-${record?.read_at ? 'active' : 'inactive'}`}
          columns={columns}
        />
      </Card>
      <SearchPatientsComment ref={searchRef} />
    </>
  );
};
export default ShowList;
