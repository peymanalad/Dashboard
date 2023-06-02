import React, {FC} from 'react';
import {useFetch, usePost} from 'hooks';
import {Button, Card, Checkbox, Col, Form, Input, InputNumber, Row} from 'antd';
import replace from 'lodash/replace';
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {isEnLocale} from 'utils';
import {MultiSelect, MultiSelectPaginate} from 'components';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import {financialService} from 'types/user';

interface Props {
  id?: number | string;
}

const FinanceInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('user_create');
  const [form] = Form.useForm();

  const fetchFinance = useFetch({
    name: ['user', id, 'financial'],
    url: 'users/{id}/financial',
    params: {id},
    enabled: true
  });

  const updateFinance = usePost({
    url: 'users/{id}/financial',
    method: 'POST',
    removeQueries: [['user', id, 'financial']],
    form
  });

  const onFinish = (value: any) => {
    const formData = new FormData();
    formData.append('full_name', value?.full_name);
    formData.append('account_id', value?.account_id);
    formData.append('bank_id', value?.bank_id?.id);
    formData.append('is_confirm', value?.is_confirm ? '1' : '0');
    formData.append('percent', value?.percent);
    formData.append('sheba', `IR${value?.sheba}`);
    forEach(value?.services, (service: financialService) => {
      formData.append(`services[${service.service.id}][percent]`, `${service.percent}`);
      formData.append(`services[${service.service.id}][price]`, `${service.price}`);
    });

    updateFinance.post(formData, {}, {id});
  };

  return (
    <Form form={form} layout="vertical" requiredMark={false} className="w-full" name="FinanceInfo" onFinish={onFinish}>
      <Card
        loading={fetchFinance.isFetching || !fetchFinance?.data}
        title={t('finance_info.label')}
        bordered={false}
        className="w-full shadow-lg">
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12}>
            <Form.Item
              label={t('finance_info.account_name')}
              name="full_name"
              initialValue={fetchFinance?.data?.bank_user?.full_name}
              rules={[{required: true, message: t('finance_info.account_err')}]}>
              <Input disabled={!fetchFinance?.data?.permissions?.bank_user} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="bank_id"
              label={t('finance_info.bank_name')}
              initialValue={fetchFinance?.data?.bank_user?.bank}
              rules={[{required: true, message: t('finance_info.bank_err')}]}>
              <MultiSelect
                url="banks"
                urlName="banks"
                keyValue="id"
                keyLabel="name"
                keyImage="picture_url"
                hasImage
                disabled={!fetchFinance?.data?.permissions?.bank_user}
                placeholder={t('choose')}
                isGeneral
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="account_id"
              label={t('finance_info.account_id')}
              initialValue={fetchFinance?.data?.bank_user?.account_id}>
              <Input disabled={!fetchFinance?.data?.permissions?.bank_user} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('finance_info.sheba')}
              initialValue={replace(fetchFinance?.data?.bank_user?.sheba, 'IR', '')}
              name="sheba"
              rules={[{required: true, message: t('finance_info.sheba_err'), len: 24}]}>
              <Input
                type="number"
                addonAfter={!isEnLocale() && 'IR'}
                addonBefore={isEnLocale() && 'IR'}
                minLength={24}
                maxLength={24}
                className="ltr-input"
                disabled={!fetchFinance?.data?.permissions?.bank_user}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} className="flex-center">
            <Form.Item
              name="is_confirm"
              valuePropName="checked"
              initialValue={fetchFinance?.data?.bank_user?.is_confirm}
              className="m-0">
              <Checkbox disabled={!fetchFinance?.data?.permissions?.bank_user}>{t('finance_info.is_confirm')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card
        loading={fetchFinance.isFetching}
        title={t('finance_info.service_percent')}
        bordered={false}
        className="w-full shadow-lg mt-2">
        <Row className="w-full overflow-x-auto md:overflow-visible">
          <Row className="w-full min-w-600px">
            <Row className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
              <Col span={8} className="text-center">
                {t('finance_info.service')}
              </Col>
              <Col span={6} className="text-center">
                {t('finance_info.price')}
              </Col>
              <Col span={6} className="text-center">
                {t('finance_info.percent')}
              </Col>
              <Col span={4} className="text-center">
                {t('finance_info.action')}
              </Col>
            </Row>
            <Form.List name="services" initialValue={fetchFinance?.data?.services}>
              {(fields, {add, remove}) => (
                <>
                  <Row gutter={[16, 8]} className="w-full p-3 border-1 border-gainsBoro border-solid m-0">
                    <Col className="w-full">
                      <Button
                        type="dashed"
                        onClick={() => add({}, 0)}
                        block
                        icon={<PlusOutlined />}
                        disabled={!fetchFinance?.data?.permissions?.services}>
                        {t('finance_info.add')}
                      </Button>
                    </Col>
                  </Row>
                  {map(fields, (field) => (
                    <Row
                      key={field.key}
                      className="w-full p-3 border-1 border-gainsBoro border-solid"
                      style={{borderTopWidth: 0}}>
                      <Col span={8} className="w-full px-1">
                        <Form.Item
                          rules={[{required: true, message: t('messages.required')}]}
                          name={[field.name, 'service']}
                          className="no-validate-message"
                          fieldKey={[field?.name, 'service']}>
                          <MultiSelectPaginate
                            url="services/paginate"
                            urlName="services"
                            keyLabel="name"
                            keyValue="id"
                            showSearch
                            listHeight={200}
                            isGeneral={false}
                            className="w-full h-full"
                            disabled={!fetchFinance?.data?.permissions?.services}
                            placeholder={t('choose')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6} className="px-1">
                        <Form.Item
                          rules={[{required: true, message: t('messages.required')}]}
                          name={[field.name, 'price']}
                          className="no-validate-message"
                          fieldKey={[field?.name, 'price']}>
                          <InputNumber className="w-full" minLength={0} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={6} className="px-1">
                        <Form.Item
                          rules={[{required: true, message: t('messages.required')}]}
                          name={[field.name, 'percent']}
                          className="no-validate-message"
                          fieldKey={[field?.name, 'percent']}>
                          <InputNumber
                            className="w-full"
                            type="number"
                            min={0}
                            max={100}
                            disabled={!fetchFinance?.data?.permissions?.services}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} className="flex justify-center">
                        <Button
                          danger
                          type="primary"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                          disabled={!fetchFinance?.data?.permissions?.services}
                        />
                      </Col>
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
            loading={updateFinance?.isLoading}
            icon={<SaveOutlined />}
            disabled={!fetchFinance?.data?.permissions?.services && !fetchFinance?.data?.permissions?.bank_user}>
            {t('finance_info.save')}
          </Button>
        </Row>
      </Card>
    </Form>
  );
};

export default FinanceInfo;
