import React, {useRef, ElementRef} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {convertUtcTimeToLocal} from 'utils';
import {Button, Space, Card, Tooltip} from 'antd';
import {
  FilterOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  CloseCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
import {SearchTicket} from 'containers';
import {CustomTable} from 'components';
import {ticketStatus} from 'types/message';
import {useDelete, usePost} from 'hooks';
import {PatientIcon, DoctorIcon} from 'assets';
import {userProps} from 'types/user';
import get from 'lodash/get';

function Factor() {
  const {t} = useTranslation('message');
  const searchRef = useRef<ElementRef<typeof SearchTicket>>(null);

  const deleteRequest = useDelete({
    url: '/tickets/{id}',
    name: 'tickets',
    titleKey: [
      ['patient', 'full_name'],
      ['patient', 'username']
    ]
  });

  const openTicket = usePost({
    url: '/tickets/{id}/open',
    method: 'POST'
  });

  const closeTicket = usePost({
    url: '/tickets/{id}/close',
    method: 'POST'
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: t('patient'),
      dataIndex: 'patient',
      key: 'patient',
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
      title: t('doctor'),
      dataIndex: 'doctor',
      key: 'doctor',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.username || '-'
    },
    {
      title: t('updated_at'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
      responsive: ['md'],
      render: (text: string) => convertUtcTimeToLocal(text)
    },
    {
      title: `${t('specifications')}`,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      responsive: ['sm'],
      render: (status: any) => (
        <Tooltip
          title={t(
            status === ticketStatus.PatientPending
              ? 'patient_pending'
              : status === ticketStatus.DoctorPending
              ? 'doctor_pending'
              : 'inactive'
          )}>
          {status === ticketStatus.PatientPending && <PatientIcon />}
          {status === ticketStatus.DoctorPending && <DoctorIcon />}
          {status === ticketStatus.Inactive && <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />}
        </Tooltip>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: any, ticket: any) => (
        <Space size={2}>
          {permissions?.view && (
            <Tooltip title={t('edit')}>
              <Link to={`/message/ticket/${ticket?.patient?.id}/${ticket?.doctor?.id}`}>
                <Button type="text" style={{color: '#035aa6'}} icon={<EditOutlined />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
                onClick={() => deleteRequest.show(ticket)}
              />
            </Tooltip>
          )}
          {permissions?.open && (
            <Tooltip title={t('open_chat')}>
              <Button
                type="text"
                loading={openTicket?.isLoading && get(openTicket?.params, 'id') === ticket?.id}
                icon={<FolderOpenOutlined style={{color: '#4CAF50'}} />}
                onClick={() => {
                  openTicket.post({}, {}, {id: ticket?.id});
                }}
              />
            </Tooltip>
          )}
          {permissions?.close && (
            <Tooltip title={t('close_chat')}>
              <Button
                type="text"
                loading={closeTicket?.isLoading && get(closeTicket?.params, 'id') === ticket?.id}
                icon={<FolderOutlined style={{color: '#F44336'}} />}
                onClick={() => {
                  closeTicket.post({}, {}, {id: ticket?.id});
                }}
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
      title={t('ticket')}
      extra={
        <Button type="primary" icon={<FilterOutlined />} onClick={showSearch}>
          {t('filter')}
        </Button>
      }>
      <SearchTicket ref={searchRef} />
      <CustomTable
        fetch="tickets/paginate"
        rowClassName={(ticket) => `bg-status-${ticket?.status}`}
        dataName="tickets"
        columns={columns}
      />
    </Card>
  );
}
export default Factor;
