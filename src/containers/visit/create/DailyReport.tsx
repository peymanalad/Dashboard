import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {usePost} from 'hooks';
import {Form, Input, Row, Col, Card, Button, Typography} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {convertUtcTimeToLocal} from 'utils';
import {CustomTable, CustomUpload} from 'components';
import get from 'lodash/get';
import {userProps} from '../../../types/user';

interface Props {
  id?: string;
}

const BasicInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');
  const [form] = Form.useForm();

  const updateDailyReport = usePost({
    url: 'status_updates',
    method: 'POST',
    removeQueries: [['visit', 'report', id]],
    form
  });

  const save = (value: any) => {
    value.visit_id = id;
    value.picture = get(value.picture, 'path');
    updateDailyReport.post(value);
  };

  const columns = [
    {
      title: t('show.creator'),
      dataIndex: 'creator',
      key: 'creator',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.username
    },
    {
      title: t('create.activity'),
      key: 'activity',
      dataIndex: ['data', 'activity'],
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('create.breathing'),
      key: 'breathing',
      dataIndex: ['data', 'breathing'],
      align: 'center',
      responsive: ['sm']
    },
    {
      title: t('create.oxygen_saturation_amount'),
      key: 'oxygen_saturation_amount',
      dataIndex: ['data', 'oxygen_saturation_amount'],
      align: 'center',
      responsive: ['sm']
    },
    {
      title: t('create.temperature'),
      key: 'temperature',
      dataIndex: ['data', 'temperature'],
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('create.pulse'),
      key: 'pulse',
      dataIndex: ['data', 'pulse'],
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('create.blood_pressure'),
      key: 'blood_pressure',
      dataIndex: ['data', 'blood_pressure'],
      align: 'center'
    },
    {
      title: t('create.sleep'),
      key: 'sleep',
      dataIndex: ['data', 'sleep'],
      align: 'center'
    },
    {
      title: t('create.nutrition'),
      key: 'nutrition',
      dataIndex: ['data', 'nutrition'],
      align: 'center'
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (value: string) => (value ? convertUtcTimeToLocal(value) : '-')
    }
  ];

  const expandable = {
    expandedRowRender: (record: any) => <Typography.Text>{record?.data?.description}</Typography.Text>
  };

  return (
    <>
      <Card title={t('edit_file.title')} bordered={false} className="w-full mb-4">
        <Form form={form} layout="vertical" name="visit" requiredMark={false} onFinish={save}>
          <Row gutter={[16, 8]} className="w-full">
            <Col xs={24} md={12} lg={8}>
              <Form.Item name={['data', 'activity']} label={t('create.activity')}>
                <Input placeholder={t('create.placeholder')} />
              </Form.Item>
              <Form.Item name={['data', 'breathing']} label={t('create.breathing')}>
                <Input placeholder={t('create.placeholder')} />
              </Form.Item>
              <Form.Item name={['data', 'oxygen_saturation_amount']} label={t('create.oxygen_saturation_amount')}>
                <Input placeholder={t('create.placeholder')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item name={['data', 'temperature']} label={t('create.temperature')}>
                <Input placeholder={t('create.temperature')} />
              </Form.Item>
              <Form.Item name={['data', 'pulse']} label={t('create.pulse')}>
                <Input placeholder={t('create.placeholder')} />
              </Form.Item>
              <Form.Item name={['data', 'blood_pressure']} label={t('create.blood_pressure')}>
                <Input placeholder={t('create.placeholder')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} className="flex flex-col upload-center">
              <Form.Item name={['data', 'sleep']} label={t('create.sleep')}>
                <Input placeholder={t('create.placeholder')} />
              </Form.Item>
              <Form.Item name={['data', 'nutrition']} label={t('create.nutrition')}>
                <Input placeholder={t('create.placeholder')} />
              </Form.Item>
              <Form.Item name="picture">
                <CustomUpload type="diseases" name="image" mode="single" typeFile="image" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name={['data', 'description']} label={t('create.description')}>
                <Input.TextArea placeholder={t('create.placeholder')} autoSize />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} className="w-full my-5">
            <Button className="w-full sm:w-unset mr-auto my-4" type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t('create.save')}
            </Button>
          </Row>
        </Form>
      </Card>
      <Card title={t('show.history_title')} bordered={false} className="w-full">
        <CustomTable
          fetch="status_updates/fetch"
          query={{visit_id: id}}
          dataName={['visit', 'report', id]}
          expandable={expandable}
          columns={columns}
        />
      </Card>
    </>
  );
};

export default BasicInfo;
