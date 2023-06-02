import React from 'react';
import {Button, Card, Checkbox, Col, Divider, Form, Input, Row} from 'antd';
import {SaveOutlined, SearchOutlined} from '@ant-design/icons';
import {useFetch, usePost} from 'hooks';
import {useParams, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {CustomUpload, MultiSelectPaginate} from 'components';
import {getLangSearchParam} from 'utils';
import filter from 'lodash/filter';
import get from 'lodash/get';
import concat from 'lodash/concat';
import map from 'lodash/map';
import isUndefined from 'lodash/isUndefined';

const EditSource = () => {
  const {t} = useTranslation('source');
  const {id} = useParams<{id?: string}>();
  const history = useHistory();

  const [form] = Form.useForm();

  const fetchSource = useFetch({
    url: 'sources/{id}',
    name: ['source', id],
    params: {id},
    enabled: !!id
  });

  const storeSource = usePost({
    url: '/sources',
    method: 'POST',
    removeQueries: ['sources'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/source/list'));
    }
  });

  const updateSource = usePost({
    url: 'sources/{id}',
    method: 'PATCH',
    removeQueries: ['sources', ['source', id]],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/source/list'));
    }
  });

  const onFinish = (values: any) => {
    values.picture = get(values.picture, [0, 'path']) || '';
    values.reference_id = values?.reference_id?.id;
    values.is_confirm = values?.is_confirm ? 1 : 0;
    values.files = concat(
      map(values.files, (item: any) => ({type: 'file', path: item?.path})),
      map(values.images, (item: any) => ({type: 'image', path: item?.path}))
    );

    id ? updateSource.post(values, {}, {id}) : storeSource.post(values);
  };

  return (
    <Card
      title={t('source')}
      bordered={false}
      className="w-full"
      loading={(id && !fetchSource?.data) || fetchSource.isFetching}>
      <Form form={form} layout="vertical" name="tag" scrollToFirstError requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
            <Form.Item
              name="title"
              label={t('title')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchSource?.data?.title}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={{span: 24, order: 3}} md={{span: 12, order: 2}} lg={{span: 8, order: 2}}>
            <Form.Item
              name="informal_title"
              label={t('informal_title')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchSource?.data?.informal_title}>
              <Input />
            </Form.Item>
          </Col>
          <Col
            xs={{span: 24, order: 1}}
            md={{span: 12, order: 1}}
            lg={{span: 8, order: 3}}
            className="flex upload-center">
            <Form.Item
              name="picture"
              noStyle
              initialValue={
                fetchSource?.data?.picture_url && {
                  path: fetchSource?.data?.picture,
                  url: fetchSource?.data?.picture_url
                }
              }>
              <CustomUpload type="recommendations" name="image" mode="single" typeFile="image" hasCrop />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="publish_year" label={t('publish_year')} initialValue={fetchSource?.data?.publish_year}>
              <Input dir="ltr" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="reference_id"
              label={t('reference')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchSource?.data?.reference}>
              <MultiSelectPaginate
                url="references/paginate"
                keyValue="id"
                keyLabel="name"
                urlName="references"
                placeholder={t('empty')}
                isGeneral
                showSearch
                treeSelect
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex-center">
            <Form.Item
              name="is_confirm"
              className="m-0"
              valuePropName="checked"
              initialValue={!isUndefined(fetchSource?.data?.is_confirm) ? fetchSource?.data?.is_confirm : true}>
              <Checkbox>{t('active')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24}>
            <Input.Group compact className="flex-center">
              <Form.Item
                name="link"
                label={t('link')}
                style={{width: '80%'}}
                rules={[{type: 'url', message: t('messages.url')}]}
                initialValue={fetchSource?.data?.link}>
                <Input className="ltr-input" dir="ltr" style={{marginBottom: '4px'}} />
              </Form.Item>
              <Button
                type="primary"
                className="d-text-none lg:d-text-unset"
                style={{width: '20%'}}
                icon={<SearchOutlined />}
                onClick={() => {
                  window.open(form.getFieldValue('link'));
                }}>
                {t('goto_link')}
              </Button>
            </Input.Group>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item name="content" label={t('content')} initialValue={fetchSource?.data?.content || ''}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label={t('description')} initialValue={fetchSource?.data?.description || ''}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="flex-center w-full flex-col">
          <Divider orientation="right">{t('pdf')}</Divider>
          <Form.Item name="files" noStyle initialValue={filter(fetchSource?.data?.files, {type: 'file'})}>
            <CustomUpload type="sources" mode="multiple" name="pdf" typeFile="pdf" />
          </Form.Item>
          <Divider orientation="right">{t('images')}</Divider>
          <Form.Item name="images" noStyle initialValue={filter(fetchSource?.data?.files, {type: 'image'})}>
            <CustomUpload type="sources" mode="multiple" name="image" typeFile="image" />
          </Form.Item>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={updateSource.isLoading || storeSource.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditSource;
