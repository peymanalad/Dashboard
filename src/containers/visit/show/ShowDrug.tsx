import React, {FC} from 'react';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {Card, Table, Tooltip, Typography} from 'antd';
import join from 'lodash/join';
import map from 'lodash/map';
import {convertUtcTimeToLocal} from 'utils';

interface Props {
  id?: string;
}

const QuestionInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');

  const fetchPrescriptions = useFetch({
    name: ['visit', 'prescription', id],
    url: 'visits/{id}/prescriptions',
    params: {id},
    enabled: true
  });

  const columns: any = [
    {
      title: t('show.prescriptionID'),
      dataIndex: ['electronicPrescription', 'head_id'],
      key: 'electronicPrescription',
      align: 'center'
    },
    {
      title: t('show.prescriptionName'),
      dataIndex: ['prescription', 'name'],
      key: 'name',
      align: 'center'
    },
    {
      title: t('show.amount'),
      dataIndex: ['amount', 'name'],
      key: 'amount',
      align: 'center'
    },
    {
      title: t('show.usage'),
      dataIndex: ['usage', 'name'],
      key: 'usage',
      align: 'center'
    },
    {
      title: t('show.time'),
      dataIndex: ['time', 'name'],
      key: 'time',
      align: 'center'
    },
    {
      title: t('show.start_at'),
      dataIndex: ['data', 'date'],
      key: 'start_at',
      align: 'center',
      render: (dataItem: string) => convertUtcTimeToLocal(dataItem, 'jYYYY/jMM/jDD')
    }
  ];

  const expandedColumns: any = [
    {
      title: t('show.periodStep'),
      dataIndex: ['period', 'step'],
      key: 'step',
      align: 'center'
    },
    {
      title: t('show.periodValue'),
      dataIndex: ['period', 'value'],
      key: 'value',
      align: 'center'
    },
    {
      title: t('show.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: t('show.repeat'),
      dataIndex: 'repeat',
      key: 'repeat',
      align: 'center'
    },
    {
      title: t('show.times'),
      dataIndex: 'times',
      key: 'times',
      align: 'center',
      render: (times: string[]) => join(times, ' ، ‌')
    },
    {
      title: t('show.is_notify'),
      dataIndex: 'is_notify',
      key: 'is_notify',
      align: 'center',
      render: (status: number) => (
        <Tooltip title={t(status ? 'active' : 'inactive')}>
          {status ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 18}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 18}} />
          )}
        </Tooltip>
      )
    }
  ];

  const expandedRowRender = (record: any) => {
    return (
      <Table
        columns={expandedColumns}
        dataSource={record?.data ? [record?.data] : undefined}
        pagination={false}
        expandable={{expandedRowRender: (record: any) => <Typography.Text>{record?.description}</Typography.Text>}}
      />
    );
  };

  return (
    <Card title={t(id ? 'edit_file.title' : 'show.title')} bordered={false} className="w-full">
      <Table
        loading={fetchPrescriptions?.isLoading}
        dataSource={map(fetchPrescriptions?.data, (data: any, key: number) => ({key, ...data}))}
        expandable={{expandedRowRender}}
        columns={columns}
      />
    </Card>
  );
};

export default QuestionInfo;
