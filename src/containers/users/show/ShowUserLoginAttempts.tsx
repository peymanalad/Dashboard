import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {convertUtcTimeToLocal} from 'utils';

interface Props {
  id?: string;
}

const ShowUserLoginAttempts: FC<Props> = ({id}) => {
  const {t} = useTranslation('user_create');

  const columns: any = [
    {
      title: t('browserInfo'),
      dataIndex: 'browserInfo',
      key: 'browserInfo',
      sorter: true,
      align: 'center'
    },
    {
      title: t('ipAddress'),
      dataIndex: 'clientIpAddress',
      key: 'clientIpAddress',
      sorter: true,
      align: 'center'
    },
    {
      title: t('loginTime'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      align: 'center',
      sorter: true,
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    }
  ];

  return (
    <CustomTable
      fetch="services/app/User/GetUserLoginAttempts"
      dataName={['users', 'logins', id]}
      columns={columns}
      query={{UserId: id}}
    />
  );
};

export default ShowUserLoginAttempts;
