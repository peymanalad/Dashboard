import React, {FC, useState} from 'react';
import {Card, Row, Form, Col, Button, Input} from 'antd';
import {useParams, useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {useTranslation} from 'react-i18next';
import {LanguageInput, MultiSelect} from 'components';
import {FlatLanguageData, getLangSearchParam, isEnLocale} from 'utils';
import {language} from 'types/general';
import {SaveOutlined} from '@ant-design/icons';

const EditRole: FC = () => {
  const {id} = useParams<{id?: string}>();
  const {t} = useTranslation('permission');
  const isEn = isEnLocale();
  const history = useHistory();

  const [form] = Form.useForm();

  const [language, setLanguage] = useState<language>(
    isEn ? {id: 2, direction: 'ltr', name: 'en'} : {id: 1, direction: 'rtl', name: 'fa'}
  );

  const fetchLanguage = useFetch({
    url: '/languages',
    name: 'languages',
    isGeneral: true,
    enabled: true
  });

  const fetchRole = useFetch({
    url: 'roles/{id}',
    name: ['role', id],
    params: {id},
    enabled: !!id
  });

  const updateRoles = usePost({
    url: 'roles/{id}',
    method: 'PATCH',
    removeQueries: ['roles', ['role', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/permission/role/list'));
    }
  });

  const createRoles = usePost({
    url: 'roles',
    method: 'POST',
    removeQueries: ['roles'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/permission/role/list'));
    }
  });

  const onFinish = (values: any) => {
    values.languages = FlatLanguageData(values?.languages);
    id ? updateRoles.post(values, {}, {id}) : createRoles.post(values);
  };

  return (
    <Card
      className="my-6"
      title={t('role')}
      bordered={false}
      loading={fetchRole.isFetching || fetchLanguage.isFetching}
      extra={
        <MultiSelect
          url="languages"
          urlName="languages"
          keyValue="id"
          keyLabel="name"
          value={language}
          onChange={setLanguage}
          isGeneral
        />
      }>
      <Form form={form} name="role" requiredMark={false} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 8]} dir={language?.direction} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="name"
              label={t('name')}
              initialValue={fetchRole?.data?.name || ''}
              rules={[{required: true, message: t('messages.required')}]}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} dir={language?.direction}>
            <LanguageInput languages={fetchLanguage?.data} data={fetchRole?.data} keyProp="title" language={language} />
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={createRoles.isLoading || updateRoles.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditRole;
