import {Card, Typography} from 'antd';
import {CustomTable} from 'components';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {userProps} from 'types/user';

const {Text} = Typography;

const UserReportTable: FC = () => {
  const {t} = useTranslation('user-show');
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: t('username'),
      dataIndex: ['user', 'username'],
      key: 'user',
      align: 'center'
    },
    {
      title: t('full_name'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.name
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: any) => <Text className={`p-user-${status}`}>{t(`statuses.${status}`)}</Text>
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      key: 'gender',
      align: 'center'
    },
    {
      title: t('weight'),
      dataIndex: 'weight',
      key: 'weight',
      align: 'center'
    },
    {
      title: t('height'),
      dataIndex: 'height',
      key: 'height',
      align: 'center'
    },
    {
      title: t('city'),
      dataIndex: 'city',
      key: 'city',
      align: 'center'
    },
    {
      title: t('age'),
      dataIndex: 'age',
      key: 'age',
      align: 'center'
    }
  ];
  return (
    <Card title={t('user_report_table')}>
      <CustomTable
        fetch="users/report/paginate"
        rowClassName={(record: any) => `bg-${record?.is_active ? 'active' : 'inactive'}`}
        dataName="user/report/paginate"
        columns={columns}
      />
    </Card>
  );
};

export default UserReportTable;
