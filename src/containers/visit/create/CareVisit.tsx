import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {Card, Row, Col, Checkbox, Button, Form} from 'antd';
import {DrillDownSelectPaginate, MultiSelectPaginate, SimpleSelect} from 'components';
import {PlusOutlined, DeleteOutlined, SaveOutlined} from '@ant-design/icons';
import {diseaseProps} from 'types/visit';
import map from 'lodash/map';
import {VisitTypes} from 'assets';

interface Props {
  id?: string;
}

const SchemeCare: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');
  const [form] = Form.useForm();

  const fetchDisease = useFetch({
    name: ['visit', 'care', id],
    url: 'visits/{id}/diseases',
    params: {id},
    enabled: true
  });

  const updateVisit = usePost({
    url: 'visits/{id}/diseases',
    method: 'POST',
    removeQueries: [['visit', 'care', id]],
    form
  });

  const onFinish = (values: any) => {
    values.diseases = map(values?.diseases, (val: diseaseProps) => ({
      disease_id: val?.disease?.id,
      subject_id: val?.subject?.id,
      is_active: val?.is_active ? 1 : 0,
      type: val?.type
    }));
    updateVisit.post(values, {}, {id});
  };

  return (
    <Card title={t('edit_file.title')} loading={fetchDisease.isFetching} bordered={false} className="w-full">
      <Form form={form} className="flex-center w-full flex-col" onFinish={onFinish}>
        <Row className="w-full overflow-x-auto md:overflow-visible">
          <Row className="w-full min-w-600px">
            <Row className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
              <Col span={8} className="text-center">
                {t('create.disease')}
              </Col>
              <Col span={8} className="text-center">
                {t('create.subject')}
              </Col>
              <Col span={4} className="text-center">
                {t('create.type')}
              </Col>
              <Col span={2} className="text-center">
                {t('create.active')}
              </Col>
              <Col span={2} className="text-center">
                {t('create.action')}
              </Col>
            </Row>
            <Form.List name="diseases" initialValue={fetchDisease?.data}>
              {(fields, {add, remove}) => (
                <>
                  <Row gutter={[16, 8]} className="w-full p-3 border-1 border-gainsBoro border-solid m-0">
                    <Col className="w-full">
                      <Button type="dashed" onClick={() => add({}, 0)} block icon={<PlusOutlined />}>
                        {t('add_care')}
                      </Button>
                    </Col>
                  </Row>
                  {map(fields, (field) => (
                    <Row
                      key={field.key}
                      className="w-full p-3 border-1 border-gainsBoro border-solid"
                      style={{borderTopWidth: 0}}>
                      <Form.Item noStyle {...field}>
                        <Col span={8} className="pl-10">
                          <Form.Item
                            rules={[{required: true, message: t('messages.required')}]}
                            name={[field.name, 'disease']}
                            className="no-validate-message"
                            fieldKey={[field?.name, 'disease']}>
                            <DrillDownSelectPaginate
                              placeholder={t('choose')}
                              className="w-full"
                              title={t('disease')}
                              mode="single"
                              notSelectParent
                              notSelectChild={false}
                              url="diseases/children"
                              urlName="diseases"
                              isGeneral
                              keyLabel="name"
                              keyValue="id"
                              showSearch
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8} className="pl-10">
                          <Form.Item
                            name={[field.name, 'subject']}
                            className="no-validate-message"
                            fieldKey={[field?.name, 'subject']}>
                            <MultiSelectPaginate
                              url="subjects/paginate"
                              urlName="subjects"
                              keyLabel="title"
                              keyValue="id"
                              showSearch
                              isGeneral
                              className="w-full h-full"
                              placeholder={t('choose')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            rules={[{required: true, message: t('messages.required')}]}
                            name={[field.name, 'type']}
                            className="no-validate-message"
                            fieldKey={[field?.name, 'type']}>
                            <SimpleSelect
                              keys="id"
                              label="name_fa"
                              placeholder={t('choose')}
                              data={VisitTypes?.map((value) => ({...value, name_fa: t(value?.name)}))}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2} className="flex justify-center items-center">
                          <Form.Item
                            name={[field.name, 'is_active']}
                            className="no-validate-message"
                            valuePropName="checked"
                            fieldKey={[field?.name, 'is_active']}>
                            <Checkbox />
                          </Form.Item>
                        </Col>
                        <Col span={2} className="flex justify-center">
                          <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                        </Col>
                      </Form.Item>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </Row>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateVisit.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default SchemeCare;
