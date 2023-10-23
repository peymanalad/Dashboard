import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, SimpleSelect} from 'components';
import {OSType} from 'assets';
import {getImageUrl, getLangSearchParam} from 'utils';
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
    storeVersion.post({
      id,
      ...values,
      updateFile: values?.updateFileToken?.updateFileToken,
      updateFileToken: values?.updateFileToken?.fileToken || values?.updateFileToken?.updateFileToken
    });
  };

  return (
    <Card
      title={t('application')}
      bordered={false}
      loading={fetchVersion.isFetching && fetchVersion.isLoading && !fetchVersion.data}
      className="w-full">
      <Form form={form} layout="vertical" name="version" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="softwareVersion"
              label={t('version')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.softwareUpdate.softwareVersion}>
              <Input className="w-full ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="buildNo"
              label={t('build_number')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchVersion?.data?.softwareUpdate.buildNo}>
              <Input type="number" className="w-full ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex upload-center">
            <Form.Item
              name="updateFileToken"
              noStyle
              initialValue={
                fetchVersion?.data?.softwareUpdate?.updateFile && {
                  updateFileToken: fetchVersion?.data?.softwareUpdate?.updateFile,
                  url: getImageUrl(fetchVersion?.data?.softwareUpdate?.updateFile)
                }
              }>
              <CustomUpload type="applications" name="apk" mode="single" typeFile="application" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
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
          <Col xs={24} md={12} lg={8} className="flex-center">
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
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto my-4"
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
