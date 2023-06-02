import React from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {TopCart} from 'containers';
import {Table, Button, Card, Divider} from 'antd';

function DrReport() {
  const {t} = useTranslation('dr_report');
  const {id} = useParams<any | null>();

  const fetchReport = useFetch({
    url: 'users/report/{id}/doctor',
    name: ['report', 'doctor'],
    params: {id},
    enabled: true
  });

  const columns = [
    {
      title: t('disease'),
      dataIndex: 'disease',
      key: 'disease',
      render: (text: any, data: any) => data?.disease?.name
    },
    {
      title: t('confirmed'),
      dataIndex: 'confirmed',
      key: 'confirmed'
    },
    {
      title: t('total'),
      dataIndex: 'total',
      key: 'total'
    }
  ];
  const itemRender = (current: any, type: any, originalElement: any) =>
    type === 'prev' ? (
      <Button type="text">{t('previous')}</Button>
    ) : type === 'next' ? (
      <Button type="text">{t('next')}</Button>
    ) : (
      originalElement
    );
  return (
    <Card className="my-4" loading={fetchReport?.isFetching || !fetchReport?.data}>
      <p className="text-xl">{t('total_info')}</p>
      <Divider />
      <TopCart {...fetchReport?.data} />
      <p className="mt-4 text-xl">{t('table_title')}</p>
      <Divider />
      <Table
        className="shadow-lg"
        bordered
        dataSource={fetchReport?.data?.diseases_recommendations}
        columns={columns}
        pagination={{
          itemRender,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) => t('showTotal', {from: range[0], to: range[1], total}),
          responsive: true
        }}
      />
    </Card>
  );
}

export default DrReport;
