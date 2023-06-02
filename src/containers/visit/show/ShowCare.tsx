import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Tooltip} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {VisitTypes} from 'assets';
import find from 'lodash/find';

interface Props {
  id?: string;
}

const SchemeCare: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');

  const columns = [
    {
      title: t('disease'),
      dataIndex: ['disease', 'name'],
      key: 'disease',
      align: 'center'
    },
    {
      title: t('subject'),
      dataIndex: ['subject', 'title'],
      key: 'subject',
      align: 'center'
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (text: any) => t(find(VisitTypes, {id: text})?.name || '-')
    },
    {
      title: t('specifications'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (status: 1 | 0) => (
        <Tooltip title={t(status === 1 ? 'confirm.true' : 'confirm.false')}>
          {status === 1 ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 18}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 18}} />
          )}
        </Tooltip>
      )
    }
  ];

  return (
    <Card title={t('show.title')} bordered={false} className="w-full">
      <CustomTable
        fetch="visits/{id}/diseases"
        params={{id}}
        rowClassName={(record) => `bg-${record?.is_active === 1 ? 'active' : 'inactive'}`}
        dataName={['visit', 'care', id]}
        columns={columns}
      />
    </Card>
  );
};

export default SchemeCare;
