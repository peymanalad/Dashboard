import React, {FC} from 'react';
import {Card, Form, Button, Tooltip, Space, Row, Col, Typography} from 'antd';
import {DeleteOutlined, LinkOutlined, PlusOutlined, SaveOutlined, EditOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {MultiSelectPaginate} from 'components';
import {validURL} from 'utils';
import reverse from 'lodash/reverse';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {Link} from 'react-router-dom';
import {useDelete} from 'hooks';

export interface props {
  fetchRecommendation: any;
  id: string;
  form: any;
  sending: boolean;
}

const {Text} = Typography;

const RecommendationSource: FC<props> = ({fetchRecommendation, form, sending, id}: props) => {
  const {t} = useTranslation('recommendation');

  const deleteRequest = useDelete({
    url: '/recommendations/{id}',
    name: 'recommendations'
  });

  return (
    <Card
      title={t('source')}
      loading={
        !isEmpty(id) && (fetchRecommendation.isLoading || fetchRecommendation.isIdle) && !fetchRecommendation.data
      }
      bordered={false}
      className="w-full card-bottom">
      <Row className="w-full overflow-x-auto md:overflow-visible">
        <Row className="w-full min-w-600px">
          <Row className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
            <Col span={12} className="text-center">
              {t('source_title')}
            </Col>
            <Col span={6} className="text-center">
              {t('reference')}
            </Col>
            <Col span={6} className="text-center">
              {t('actions')}
            </Col>
          </Row>
          <Form.List
            name="sources"
            rules={[
              {
                validator: (rule, value) => {
                  if (!isEmpty(value)) return Promise.resolve();
                  return Promise.reject(t('messages.required'));
                }
              }
            ]}
            initialValue={fetchRecommendation?.data?.sources}>
            {(fields, {add, remove}, {errors}) => (
              <>
                <Row className="w-full p-3 border-1 border-gainsBoro border-solid">
                  <Col className="w-full">
                    <Button type="dashed" danger={!isEmpty(errors)} onClick={() => add()} block icon={<PlusOutlined />}>
                      {t('add_new_source')}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Form.ErrorList errors={errors} />
                </Row>
                {reverse(fields)?.map((field) => (
                  <Row
                    key={field.key}
                    className="w-full p-3 border-1 border-gainsBoro border-solid items-center"
                    style={{borderTopWidth: 0}}>
                    <Col span={12} className="w-full pl-10">
                      <Form.Item
                        rules={[{required: true, message: t('messages.required')}]}
                        name={field?.name}
                        className="no-validate-message"
                        fieldKey={field?.name}>
                        <MultiSelectPaginate
                          url="sources/paginate"
                          urlName="sources"
                          keyLabel="title"
                          keyValue="id"
                          showSearch
                          isGeneral
                          className="w-full h-full"
                          placeholder={t('choose')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item noStyle shouldUpdate>
                        {() => (
                          <Form.Item
                            name={[field.name, 'reference', 'name']}
                            className="no-validate-message"
                            fieldKey={[field?.name, 'reference', 'name']}>
                            <Text className="text-center d-block">
                              {get(form.getFieldValue('sources'), [field.name, 'reference', 'name'])}
                            </Text>
                          </Form.Item>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6} className="flex justify-center">
                      <Form.Item noStyle shouldUpdate>
                        {() => (
                          <Form.Item
                            name={[field.name, 'link']}
                            className="no-validate-message"
                            fieldKey={[field?.name, 'link']}>
                            <Space size="small">
                              <Button
                                danger
                                type="primary"
                                icon={<DeleteOutlined />}
                                onClick={() => remove(field.name)}
                              />
                              <Tooltip title={t('goto-link')}>
                                <Button
                                  type="text"
                                  style={{
                                    color: validURL(get(form.getFieldValue('sources'), [field.name, 'link']))
                                      ? '#009a9a'
                                      : ''
                                  }}
                                  icon={<LinkOutlined />}
                                  disabled={!validURL(get(form.getFieldValue('sources'), [field?.name, 'link']))}
                                  onClick={() => window.open(get(form.getFieldValue('sources'), [field?.name, 'link']))}
                                />
                              </Tooltip>
                              <Tooltip title={t('edit-source')}>
                                <Link
                                  to={`/education/source/edit/${get(form.getFieldValue('sources'), [
                                    field?.name,
                                    'id'
                                  ])}`}>
                                  <Button
                                    type="text"
                                    style={{
                                      color: get(form.getFieldValue('sources'), [field?.name, 'id']) ? '#035aa6' : ''
                                    }}
                                    disabled={!get(form.getFieldValue('sources'), [field?.name, 'id'])}
                                    icon={<EditOutlined />}
                                  />
                                </Link>
                              </Tooltip>
                            </Space>
                          </Form.Item>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        </Row>
      </Row>
      <Row gutter={[16, 8]} className="flex flex-col sm:flex-row items-center justify-between my-5">
        {fetchRecommendation?.data?.permissions?.delete && (
          <Button
            type="primary"
            htmlType="button"
            className="ml-auto w-full sm:w-unset"
            danger
            onClick={() => deleteRequest.show({id})}
            loading={deleteRequest?.isLoading}
            icon={<DeleteOutlined />}>
            {t('delete')}
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          className="w-full sm:w-unset mr-auto my-4"
          loading={sending}
          icon={<SaveOutlined />}>
          {t('save')}
        </Button>
      </Row>
    </Card>
  );
};

export default RecommendationSource;
