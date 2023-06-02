import React, {useState, useEffect, FC} from 'react';
import {Card, Form, Checkbox, Button, Input, Radio, Row, Col, Typography, InputNumber} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {CustomUpload, DateTimePicker, MultiSelect, MultiSelectPaginate} from 'components';
import {useHistory} from 'react-router-dom';
import {useFetch, usePost} from 'hooks';
import {getLangSearchParam} from 'utils';
import map from 'lodash/map';

const {Text} = Typography;

const AccountInfo: FC = () => {
  const {t} = useTranslation('user_create');
  const history = useHistory();
  const [form] = Form.useForm();
  const [role, setRole] = useState<number | null>(null);

  const getPermissions = useFetch({
    url: 'users/access_store',
    params: {role_id: role}
  });

  const create = usePost({
    url: 'users',
    method: 'POST',
    form,
    onSuccess: (data) => {
      history.push(getLangSearchParam(`/user/edit/${data?.id}`));
    }
  });

  useEffect(() => {
    if (role) getPermissions.refetch();
  }, [role]);

  const onFinish = (val: any) => {
    val.value.avatar = val?.avatar?.path;
    val.role_id = val.role_id?.id;
    val.language = val.language?.name;
    if (getPermissions?.data?.permissions?.city_id) val.location_id = val.city?.id;
    if (getPermissions?.data?.permissions?.parents) val.clinics_id = map(val.clinics_id, 'id');
    val.value.birthday = getPermissions?.data?.permissions?.birthday ? val?.value?.birthday : undefined;
    create.post(val);
  };

  return (
    <Card
      title={t('account_info.label')}
      loading={getPermissions.isFetching}
      bordered={false}
      className="w-full shadow-lg">
      <Form
        layout="vertical"
        requiredMark={false}
        form={form}
        className=" w-full"
        name="createUSer"
        onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
            <Form.Item
              name="role_id"
              label={t('account_info.role')}
              rules={[{required: true, message: t('validation.required')}]}>
              <MultiSelect
                url="roles/view_users"
                keyValue="id"
                keyLabel="title"
                onChange={(data: any, key: number) => setRole(key)}
                urlName="roles_view_users"
                placeholder={t('empty')}
                isGeneral={false}
                showSearch
              />
            </Form.Item>
          </Col>
          {getPermissions?.data?.permissions?.language && (
            <Col xs={{span: 24, order: 3}} md={{span: 12, order: 3}} lg={{span: 8, order: 2}}>
              <Form.Item
                name="language"
                label={t('account_info.language')}
                rules={[{required: true, message: t('validation.required')}]}>
                <MultiSelect url="languages" urlName="languages" keyValue="id" keyLabel="name" isGeneral showSearch />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.avatar && (
            <Col
              xs={{span: 24, order: 1}}
              md={{span: 12, order: 1}}
              lg={{span: 8, order: 3}}
              className="flex upload-center">
              <Form.Item name="avatar" noStyle>
                <CustomUpload type="users" name="image" mode="single" typeFile="image" hasCrop />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          {getPermissions?.data?.permissions?.first_name && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={t('account_info.first_name')}
                name={['identity', 'first_name']}
                rules={[{required: true, message: t('validation.required')}]}>
                <Input />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.last_name && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={t('account_info.last_name')}
                name={['identity', 'last_name']}
                rules={[{required: true, message: t('validation.required')}]}>
                <Input />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.name && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={t('account_info.name')}
                name={['value', 'name']}
                rules={[{required: true, message: t('validation.required')}]}>
                <Input />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.username && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={t('account_info.username')}
                name="username"
                rules={[{required: true, message: t('validation.required')}]}>
                <Input />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.birthday && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item name={['value', 'birthday']} label={t('account_info.birthday')}>
                <DateTimePicker isGregorian={false} timePicker={false} />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.degree && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item label={t('account_info.degree')} name={['value', 'degree']}>
                <Input />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.password && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={t('account_info.password')}
                name="password"
                rules={[
                  {required: true, message: t('validation.required')},
                  {pattern: /^[A-Za-z0-9][A-Za-z0-9]*$/, message: t('validation.correctPassword')}
                ]}>
                <Input className="ltr-input" />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.mobile && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={t('account_info.mobile')}
                name="mobile"
                rules={[{len: 11, message: t('validation.mobile')}]}>
                <Input inputMode="tel" minLength={11} maxLength={11} className="ltr-input" />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.height && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item label={t('account_info.height')} name={['value', 'height']}>
                <InputNumber type="number" className="w-full" />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.weight && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item label={t('account_info.weight')} name={['value', 'weight']}>
                <InputNumber type="number" className="w-full" />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.job && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item label={t('account_info.career')} name="job">
                <Input />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.national_code && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={t('account_info.national_code')}
                name={['identity', 'national_code']}
                rules={[{len: 10, message: t('validation.nationalCode')}]}>
                <Input type="tel" className="ltr-input" minLength={10} maxLength={10} />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.email && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item label={t('account_info.email')} name="email">
                <Input type="email" className="ltr-input" />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.city_id && (
            <Col span={24}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, nextValues) =>
                  prevValues.country !== nextValues.country || prevValues.province !== nextValues.province
                }>
                {() => (
                  <Row gutter={[16, 8]} className="w-full m-0">
                    <Col span={24}>
                      <Text className="text-dark font-500">{t('account_info.address')}</Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item name="country">
                        <MultiSelectPaginate
                          url="locations/paginate"
                          keyValue="id"
                          keyLabel="name"
                          urlName="locations_country"
                          onChange={(link: any) => {
                            form.setFieldsValue({
                              country: link,
                              city: undefined,
                              province: undefined
                            });
                          }}
                          isGeneral
                          showSearch
                          dropDownWith={200}
                          placeholder={t('account_info.country')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item name="province">
                        <MultiSelectPaginate
                          url="locations/paginate"
                          keyValue="id"
                          keyLabel="name"
                          urlName="locations_province"
                          isGeneral
                          onChange={(link: any) => {
                            form.setFieldsValue({
                              city: undefined,
                              province: link
                            });
                          }}
                          showSearch
                          disabled={!form.getFieldValue('country')}
                          dropDownWith={200}
                          placeholder={t('account_info.province')}
                          params={{parent_id: form.getFieldValue('country')?.id}}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item name="city">
                        <MultiSelectPaginate
                          url="locations/paginate"
                          keyValue="id"
                          keyLabel="name"
                          urlName="locations_city"
                          isGeneral
                          showSearch
                          dropDownWith={200}
                          disabled={!form.getFieldValue('province')}
                          placeholder={t('account_info.city')}
                          params={{parent_id: form.getFieldValue('province')?.id}}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24} className="pl-0">
                      <Form.Item name={['identity', 'address']}>
                        <Input.TextArea placeholder={t('account_info.address')} autoSize />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.gender && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                name="gender"
                label={t('account_info.sex')}
                className="text-center"
                rules={[{required: true, message: t('validation.required')}]}>
                <Radio.Group>
                  <Radio value="male">{t('account_info.male')}</Radio>
                  <Radio value="female">{t('account_info.female')}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.marital_status && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                name={['value', 'marital_status']}
                label={t('account_info.marital_status')}
                className="text-center"
                rules={[{required: true, message: t('validation.required')}]}>
                <Radio.Group>
                  <Radio value="single">{t('account_info.single')}</Radio>
                  <Radio value="married">{t('account_info.married')}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.is_active && (
            <Col xs={24} md={12} lg={8} className="flex-center">
              <Form.Item name="is_active" valuePropName="checked">
                <Checkbox>{t('account_info.active')}</Checkbox>
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.parents && (
            <Col span={24}>
              <Form.Item name="clinics_id" label={t('account_info.clinics')}>
                <MultiSelectPaginate
                  mode="multiple"
                  url="users/clinics"
                  keyValue="id"
                  keyLabel="name"
                  keySubTitle="location"
                  urlName="clinics"
                  placeholder={t('account_info.not_selected_clinics')}
                  isGeneral
                  showSearch
                  showSubTitle
                  dropDownWith
                  className="w-32"
                  alignDropDownTop
                />
              </Form.Item>
            </Col>
          )}
          {getPermissions?.data?.permissions?.note && (
            <Col span={24}>
              <Form.Item name={['value', 'note']} label={t('account_info.note')}>
                <Input.TextArea placeholder={t('account_info.empty')} autoSize />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row className="w-full flex justify-end my-5">
          <Button type="primary" htmlType="submit" loading={create.isLoading} icon={<SaveOutlined />} disabled={!role}>
            {t('account_info.save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default AccountInfo;
