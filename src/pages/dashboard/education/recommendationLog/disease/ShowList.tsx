import React, {FC} from 'react';
import {Button, Card} from 'antd';
import {FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {usePost} from 'hooks';

const ShowList: FC = () => {
  const {t} = useTranslation('recommendation');

  const getReportExcel = usePost({
    url: '/recommender_logs/diseases/excel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(data.path, '_self');
    }
  });

  const columns: any = [
    {
      title: t('disease'),
      dataIndex: ['disease', 'name'],
      key: 'disease',
      align: 'center'
    },
    {
      title: t('end_recommendation'),
      dataIndex: 'end_recommendation',
      key: 'end_recommendation',
      align: 'center'
    },
    {
      title: t('exclude_disease'),
      dataIndex: 'exclude_disease',
      key: 'exclude_disease',
      align: 'center'
    },
    {
      title: t('limit_recommendation'),
      dataIndex: 'limit_recommendation',
      key: 'limit_recommendation',
      align: 'center'
    },
    {
      title: t('not_confirmed'),
      dataIndex: 'not_confirmed',
      key: 'not_confirmed',
      align: 'center'
    },
    {
      title: t('total'),
      dataIndex: 'total',
      key: 'total',
      align: 'center'
    }
  ];

  return (
    <Card
      title={t('logs')}
      extra={
        <Button
          className="d-text-none md:d-text-unset ant-btn-success"
          type="primary"
          onClick={() => getReportExcel.post({})}
          loading={getReportExcel.isLoading}
          icon={<FileExcelOutlined />}>
          {t('report_section.get_Excel')}
        </Button>
      }>
      <CustomTable
        fetch="recommender_logs/diseases"
        dataName={['recommenderLog', 'disease']}
        hasIndexColumn
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
