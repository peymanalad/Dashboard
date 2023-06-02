import React, {ElementRef, useRef, FC} from 'react';
import {Card, Row, Col, Form, Input, Button, Collapse, Spin} from 'antd';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {useHistory, useParams} from 'react-router-dom';
import {SaveOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {JsonEditor, FormBuilder, FormBuilderHelpModal, MultiSelect} from 'components';
import {getLangSearchParam} from 'utils';

const {Panel} = Collapse;

const EditConfig: FC = () => {
  const history = useHistory();
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('setting');
  const helpModalRef = useRef<ElementRef<typeof FormBuilderHelpModal>>(null);

  const [form] = Form.useForm();

  const fetchConfig = useFetch({
    name: ['config', id],
    url: 'configs/{id}/edit',
    params: {id},
    enabled: !!id
  });

  const updateConfig = usePost({
    url: 'configs/{id}',
    method: 'PATCH',
    removeQueries: ['configs', ['config', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/config/list'));
    }
  });

  const storeConfig = usePost({
    url: 'configs',
    method: 'POST',
    removeQueries: ['configs'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/setting/config/list'));
    }
  });

  const onFinish = (values: any) => {
    values.language = values?.language?.name;
    id ? updateConfig.post(values, {}, {id}) : storeConfig.post(values);
  };

  return (
    <Form form={form} layout="vertical" name="config" requiredMark={false} onFinish={onFinish}>
      <Card title={t('config')} bordered={false} loading={fetchConfig.isFetching} className="w-full">
        <FormBuilderHelpModal
          ref={helpModalRef}
          onSelectHelp={(schema) =>
            form.setFields([
              {
                name: 'schema',
                value: schema
              }
            ])
          }
        />
        <Form.Item noStyle shouldUpdate={(prevValues, nextValues) => prevValues?.schema !== nextValues?.schema}>
          {() => (
            <FormBuilder
              name={['value']}
              form={form}
              data={form.getFieldValue('schema') || fetchConfig?.data?.schema}
              showLabel
              initialValues={{value: fetchConfig?.data?.value}}
            />
          )}
        </Form.Item>
        <Row gutter={[16, 8]} className="w-full flex justify-end align-center my-5 ">
          <Button
            type="primary"
            htmlType="submit"
            loading={storeConfig.isLoading || updateConfig.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Card>
      <Collapse className="my-2">
        <Panel
          forceRender
          header={t('setting')}
          key="1"
          extra={
            <ExclamationCircleOutlined
              className="text-red"
              onClick={(event) => {
                event.stopPropagation();
                if (helpModalRef.current) helpModalRef.current.open();
              }}
            />
          }>
          {fetchConfig?.isFetching ? (
            <Spin className="flex-center m-2" />
          ) : (
            <Row
              gutter={[16, 8]}
              className="w-full"
              onPaste={(event) => {
                try {
                  event.stopPropagation();
                  event.preventDefault();
                  const clipboardData = JSON.parse(event.clipboardData?.getData('Text'));
                  form.setFields([
                    {
                      name: 'schema',
                      value: clipboardData
                    }
                  ]);
                } catch (e) {
                  console.error(e);
                }
              }}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  name="key"
                  label={t('key')}
                  initialValue={fetchConfig?.data?.key}
                  rules={[{required: true, message: t('messages.required')}]}>
                  <Input className="ltr-input" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  name="name"
                  label={t('name')}
                  initialValue={fetchConfig?.data?.name}
                  rules={[{required: true, message: t('messages.required')}]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  name="language"
                  label={t('language')}
                  initialValue={{name: fetchConfig?.data?.language}}
                  rules={[{required: true, message: t('validation.required')}]}>
                  <MultiSelect url="languages" urlName="languages" keyValue="name" keyLabel="name" isGeneral />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="schema"
                  label={t('schema')}
                  initialValue={fetchConfig?.data?.schema}
                  rules={[{required: true, message: t('messages.required')}]}>
                  <JsonEditor collapsed={false} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Panel>
      </Collapse>
    </Form>
  );
};

export default EditConfig;
