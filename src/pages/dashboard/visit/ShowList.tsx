import React, {useRef, ElementRef, FC} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete} from 'hooks';
import {convertUtcTimeToLocal} from 'utils';
import {Button, Space, Card, Tooltip} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HourglassOutlined
} from '@ant-design/icons';
import {SearchVisit} from 'containers';
import {CustomTable} from 'components';
import {userProps} from 'types/user';

const ShowList: FC = () => {
  const {t} = useTranslation('visit');
  const searchRef = useRef<ElementRef<typeof SearchVisit>>(null);

  const deleteRequest = useDelete({
    url: '/visits/{id}',
    name: 'visits'
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('patient'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps) => (
        <Tooltip title={user?.mobile}>
          <Link className="table-link" to={`/user/edit/${user?.id}`}>
            {user?.full_name || user?.username}
          </Link>
        </Tooltip>
      )
    },
    {
      title: t('doctor_name'),
      dataIndex: 'doctor',
      key: 'doctor',
      align: 'center',
      render: (doctor: userProps) => (
        <Link className="table-link" to={`/user/edit/${doctor?.id}`}>
          {doctor?.full_name || doctor?.username}
        </Link>
      )
    },
    {
      title: t('care_center'),
      dataIndex: ['clinic', 'name'],
      key: 'clinic',
      align: 'center'
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime) : '')
    },
    {
      title: t('specifications'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      responsive: ['sm'],
      render: (status: string, visit: any) => (
        <Space size="middle">
          <Tooltip title={t(status)}>
            {status === 'active' && <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 18}} />}
            {status === 'inactive' && <CloseCircleOutlined style={{color: '#F44336', fontSize: 18}} />}
            {status === 'pending' && <HourglassOutlined style={{color: '#FFC107', fontSize: 18}} />}
          </Tooltip>
          {visit?.deleted_at && (
            <Tooltip title={t('deleted_at') + convertUtcTimeToLocal(visit?.deleted_at, 'jYYYY/jMM/jDD')}>
              <DeleteOutlined style={{color: '#F44336', fontSize: 18}} />
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
      render: (permissions: any, visit: any) => (
        <Space size={2}>
          {visit?.permissions?.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/visit/edit/${visit?.id}`}>
                <Button type="text" style={{color: '#035aa6'}} icon={<EditOutlined />} />
              </Link>
            </Tooltip>
          )}
          {visit?.permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                onClick={() => deleteRequest.show(visit)}
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
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
    <Card
      title={t('title')}
      extra={
        <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
          {t('filter')}
        </Button>
      }>
      <SearchVisit ref={searchRef} />
      <CustomTable
        fetch="visits/paginate"
        rowClassName={(visit: any) => `bg-${visit?.status}`}
        dataName="appointments"
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
