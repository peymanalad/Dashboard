import React, {FC} from 'react';
import {Button, Card, Tooltip} from 'antd';
import {EyeOutlined, FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {usePost} from 'hooks';
import {Link} from 'react-router-dom';

const ShowList: FC = () => {
  const {t} = useTranslation('recommendation');

  const getReportExcel = usePost({
    url: '/recommender_logs/doctors/excel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(data.path, '_self');
    }
  });

  const columns: any = [
    {
      title: t('doctor'),
      dataIndex: ['doctor', 'full_name'],
      key: 'doctor',
      align: 'center'
    },
    {
      title: t('count'),
      dataIndex: 'count',
      key: 'count',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (actions: any, log: any) => (
        <Tooltip title={t('showDiseaseDetail')}>
          <Link to={`/education/recommendationLog/doctor/disease/${log?.doctor?.id}`}>
            <Button type="text" className="text-orange" icon={<EyeOutlined />} />
          </Link>
        </Tooltip>
      )
    }
  ];

  return (
    <Card
      title={t('logs')}
      extra={
        <Button
          className="d-text-none md:d-text-unset ant-btn-success"
          type="primary"
          onClick={() => {
            getReportExcel.post({});
          }}
          loading={getReportExcel.isLoading}
          icon={<FileExcelOutlined />}>
          {t('report_section.get_Excel')}
        </Button>
      }>
      <CustomTable
        fetch="recommender_logs/doctors"
        dataName={['recommenderLog', 'doctor']}
        hasIndexColumn
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
