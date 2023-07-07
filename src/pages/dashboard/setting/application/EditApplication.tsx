import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox} from 'antd';
import {SaveOutlined, SearchOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {SimpleSelect} from 'components';
import {requiredVersionType, OSType} from 'assets';
import {getLangSearchParam} from 'utils';
import map from 'lodash/map';

const EditApplication: FC = () => {
  const {t} = useTranslation('setting');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchVersion = useFetch({
    name: ['softwareUpdates', id],
    url: '/services/app/SoftwareUpdates/GetSoftwareUpdateForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeVersion = usePost({
    url: '/services/app/SoftwareUpdates/CreateOrEdit',
    method: 'POST',
    removeQueries: ['softwareUpdates'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/application/list'));
    }
  });

  const onFinish = (values: any) => {
    storeVersion.post({id, ...values});
  };

  return (
    <Card
      title={t('application')}
      bordered={false}
      loading={fetchVersion.isFetching && fetchVersion.isLoading && !fetchVersion.data}
      className="w-full">
      <Form form={form} layout="vertical" name="version" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="softwareVersion"
              label={t('version')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.softwareUpdate.softwareVersion}>
              <Input className="w-full ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="buildNo"
              label={t('build_number')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.softwareUpdate.buildNo}>
              <Input type="number" className="w-full ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item
              name="platform"
              label={t('os')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.softwareUpdate.platform}>
              <SimpleSelect
                keys="name"
                label="name_fa"
                data={map(OSType, (value) => ({...value, name_fa: t(value?.name)}))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6} className="flex-center">
            <Form.Item
              name="forceUpdate"
              valuePropName="checked"
              className="m-0"
              initialValue={!!fetchVersion?.data?.softwareUpdate?.forceUpdate}>
              <Checkbox>{t('required')}</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="whatsNew"
              label={t('changes')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.softwareUpdate.whatsNew}>
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24}>
            <Input.Group compact className="flex-center">
              <Form.Item
                name="updatePath"
                label={t('link')}
                style={{width: '80%'}}
                rules={[{type: 'url', message: t('messages.url')}]}
                initialValue={fetchVersion?.data?.softwareUpdate.updatePath}>
                <Input className="ltr-input rounded-l-none" dir="ltr" style={{marginBottom: '4px'}} />
              </Form.Item>
              <Button
                type="primary"
                className="d-text-none sm:d-text-unset"
                style={{width: '20%'}}
                icon={<SearchOutlined />}
                onClick={() => {
                  window.open(form.getFieldValue('updatePath'));
                }}>
                {t('goto_link')}
              </Button>
            </Input.Group>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={storeVersion.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditApplication;
