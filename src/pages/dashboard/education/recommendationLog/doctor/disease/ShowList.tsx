import React, {FC} from 'react';
import {Button, Card} from 'antd';
import {FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {usePost} from 'hooks';
import {useParams} from 'react-router-dom';

const ShowList: FC = () => {
  const {t} = useTranslation('recommendation');
  const {id} = useParams<{id?: string}>();

  const getReportExcel = usePost({
    url: '/recommender_logs/doctor_diseases/excel',
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
      title: t('count'),
      dataIndex: 'count',
      key: 'count',
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
          onClick={() => getReportExcel.post({}, {doctor_id: id})}
          loading={getReportExcel.isLoading}
          icon={<FileExcelOutlined />}>
          {t('report_section.get_Excel')}
        </Button>
      }>
      <CustomTable
        fetch="recommender_logs/doctor_diseases"
        dataName={['recommenderLog', 'doctor', 'disease', id]}
        query={{doctor_id: id}}
        hasIndexColumn
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
