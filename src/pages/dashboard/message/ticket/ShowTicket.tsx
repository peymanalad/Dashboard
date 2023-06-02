import React, {memo} from 'react';
import {Space, Tooltip} from 'antd';
import {useTranslation} from 'react-i18next';
import {DropDownMenu, MessageContainer} from 'components';
import {CloseCircleOutlined, CopyOutlined, FormOutlined} from '@ant-design/icons';
import {useInfinite, useModifyQuery, usePost} from 'hooks';
import {useParams, useHistory} from 'react-router-dom';
import {DoctorIcon, PatientIcon} from 'assets';
import {ticketStatus} from 'types/message';
import {getLangSearchParam} from 'utils';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';

const Comment = () => {
  const {t} = useTranslation('message');
  const {patient_id, doctor_id} = useParams<any>();
  const history = useHistory();
  const ticketQuery = useModifyQuery({
    queryName: ['ticket', doctor_id, patient_id]
  });

  const getTicket = useInfinite({
    url: 'tickets/fetch',
    name: ['ticket', doctor_id, patient_id],
    query: {patient_id, doctor_id},
    staticKey: ['patient', 'doctor', 'permissions', 'status'],
    infiniteKey: 'messages',
    enabled: true
  });

  const closeTicket = usePost({
    url: '/tickets/{id}/close',
    onSuccess() {
      ticketQuery.updateQuery({objectPath: 'status'}, 3);
    }
  });

  return (
    <MessageContainer
      getMessageData={getTicket}
      urlName={['ticket', doctor_id, patient_id]}
      myUserID={toNumber(doctor_id)}
      messagesKey="messages"
      deleteUrl={`messages/{id}?patient_id=${patient_id}&doctor_id=${doctor_id}`}
      updateUrl="/messages/{id}/"
      postUrl="/messages"
      useAdvancedComposer
      disableMentionUser
      cardTitle={
        !getTicket?.isFetching
          ? t('messages.ticket_card_header', {
              patient:
                get(getTicket?.data, ['patient', 'full_name']) || get(getTicket?.data, ['patient', 'username']) || '',
              doctor:
                get(getTicket?.data, ['doctor', 'full_name']) || get(getTicket?.data, ['doctor', 'username']) || ''
            })
          : ''
      }
      cardExtra={
        <Space size="small">
          {getTicket?.data ? (
            <Tooltip title={t(`status.${getTicket?.data?.status}`)}>
              <Tooltip
                title={t(
                  getTicket?.data?.status === ticketStatus.PatientPending
                    ? 'patient_pending'
                    : getTicket?.data?.status === ticketStatus.DoctorPending
                    ? 'doctor_pending'
                    : 'inactive'
                )}>
                {getTicket?.data?.status === ticketStatus.PatientPending && <PatientIcon />}
                {getTicket?.data?.status === ticketStatus.DoctorPending && <DoctorIcon />}
                {getTicket?.data?.status === ticketStatus.Inactive && (
                  <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
                )}
              </Tooltip>
            </Tooltip>
          ) : null}
          <DropDownMenu
            items={[
              {
                name: t('user-info'),
                onClick: () => {
                  history.push(getLangSearchParam(`/user/show/${patient_id}`));
                },
                icon: <CopyOutlined />
              },
              {
                name: t('user-visits'),
                onClick: () => {
                  history.push(getLangSearchParam(`/visits/list?user_id=${patient_id}`));
                },
                icon: <CopyOutlined />
              },
              {
                name: t('user-support'),
                onClick: () => {
                  history.push(getLangSearchParam(`/message/support/chat/${patient_id}`));
                },
                icon: <FormOutlined />
              },
              {
                name: t('close_chat'),
                danger: true,
                onClick: () => {
                  closeTicket.post({}, {}, {id: get(getTicket?.data, ['messages', 0, 'ticket_id'])});
                },
                icon: <CloseCircleOutlined />
              }
            ]}
          />
        </Space>
      }
    />
  );
};

export default memo(Comment);
