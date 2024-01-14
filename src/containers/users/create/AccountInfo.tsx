import React, {useState, FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {CustomUpload, DateTimePicker, MultiSelect, MultiSelectPaginate} from 'components';
import qs from 'qs';
import {useHistory, Link} from 'react-router-dom';
import {useFetch, useLogOut, usePost, useUser} from 'hooks';
import {convertTimeToUTC, getLangSearchParam} from 'utils';
import {Card, Form, Button, Input, Radio, Row, Col, Typography, InputNumber} from 'antd';
import {FormOutlined, SaveOutlined, LogoutOutlined} from '@ant-design/icons';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import {passwordRegex} from 'assets';

interface Props {
  id: number | string;
}

const {Text} = Typography;

const AccountInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('user_create');
  const history = useHistory();
  const userInstance = useUser();
  const logOut = useLogOut();

  const [form] = Form.useForm();

  const [role, setRole] = useState<number>();

  const fetchUser = useFetch({
    url: 'users/{id}',
    name: ['user', id, 'account'],
    params: {id},
    enabled: !!id
  });

  useEffect(() => {
    setRole(fetchUser?.data?.role?.id);
  }, [fetchUser?.data]);

  const updateUser = usePost({
    url: 'users/{id}',
    method: 'PATCH',
    isUrlencoded: true,
    removeQueries: ['users', ['user', id, 'account']],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/user/list'));
    }
  });

  const onFinish = (val: any) => {
    const urlencoded = new URLSearchParams();
    if (val?.degree && fetchUser?.data?.permissions?.degree) {
      urlencoded.append('value[degree]', val?.degree || '');
    }
    if (val?.weight && fetchUser?.data?.permissions?.weight) {
      urlencoded.append('value[weight]', val?.weight || '');
    }
    if (val?.height && fetchUser?.data?.permissions?.height) {
      urlencoded.append('value[height]', val?.height || '');
    }
    if (fetchUser?.data?.permissions?.first_name) {
      urlencoded.append('identity[first_name]', val?.first_name || '');
    }
    if (fetchUser?.data?.permissions?.name) {
      urlencoded.append('value[name]', val?.name || '');
    }
    if (fetchUser?.data?.permissions?.last_name) {
      urlencoded.append('identity[last_name]', val?.last_name || '');
    }
    if (fetchUser?.data?.permissions?.national_code) {
      urlencoded.append('identity[national_code]', val?.national_code || '');
    }
    if (fetchUser?.data?.permissions?.address) {
      urlencoded.append('identity[address]', val?.address || '');
    }
    if (fetchUser?.data?.permissions?.nickname) {
      urlencoded.append('value[nickname]', val?.nickname || '');
    }
    if (fetchUser?.data?.permissions?.avatar) {
      urlencoded.append('value[avatar]', get(val?.avatar, ['path']) || '');
    }
    if (fetchUser?.data?.permissions?.medical_council_code) {
      urlencoded.append('value[medical_council_code]', val?.medical_council_code);
    }
    if (fetchUser?.data?.permissions?.note) {
      urlencoded.append('value[note]', val?.note || '');
    }
    if (fetchUser?.data?.permissions?.description) {
      urlencoded.append('value[description]', val?.description || '');
    }
    if (fetchUser?.data?.permissions?.marital_status) {
      urlencoded.append('value[marital_status]', val?.marital_status);
    }
    if (fetchUser?.data?.permissions?.gender) {
      urlencoded.append('value[gender]', val?.gender);
    }
    if (fetchUser?.data?.permissions?.birthday && val?.birthday) {
      urlencoded.append('value[birthday]', convertTimeToUTC(val?.birthday, 'YYYY-MM-DD') || '');
    }
    if (fetchUser?.data?.permissions?.email) {
      urlencoded.append('email', val?.email || '');
    }
    if (fetchUser?.data?.permissions?.mobile) {
      urlencoded.append('mobile', val?.mobile || '');
    }
    if (fetchUser?.data?.permissions?.role_id) {
      urlencoded.append('role_id', val?.roles?.id || fetchUser?.data?.role?.id);
    }
    if (fetchUser?.data?.permissions?.language) {
      urlencoded.append('language', val.language?.name);
    }
    if (fetchUser?.data?.permissions?.address && val?.city) {
      urlencoded.append('location_id', val?.city?.id);
    }
    if (fetchUser?.data?.permissions?.password && val?.password) {
      urlencoded.append('password', val?.password);
    }
    if (fetchUser?.data?.permissions?.parents) {
      forEach(val?.parents_id, (parent: any, index: number) => {
        urlencoded.append(`parents_id[${index}]`, parent?.id);
      });
    }
    updateUser.post(urlencoded, {}, {id});
  };

  return (
    <Form layout="vertical" requiredMark={false} form={form} className=" w-full" name="AccountInfo" onFinish={onFinish}>
      <Card
        title={t('account_info.label')}
        bordered={false}
        className="w-full"
        loading={(id && !fetchUser?.data) || fetchUser.isFetching}
        extra={
          role === 4 && (
            <Link
              to={`/visit/create/?${qs.stringify({
                user: {id, full_name: form.getFieldValue('first_name') + form.getFieldValue('last_name')}
              })}`}>
              <Button className="mx-2 d-none md:d-block" type="primary" icon={<FormOutlined />}>
                {t('account_info.add_visit')}
              </Button>
            </Link>
          )
        }>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="roles"
              label={t('account_info.role')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchUser?.data?.role}>
              <MultiSelect
                url="roles/view_users"
                keyValue="id"
                keyLabel="title"
                disabled={!fetchUser?.data?.permissions?.role_id}
                onChange={(val: any, i: number) => setRole(i)}
                urlName="roles_view_users"
                placeholder={t('empty')}
                isGeneral={false}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="username" label={t('account_info.username')} initialValue={fetchUser?.data?.username}>
              <Input className="ltr-input" disabled={!fetchUser?.data?.permissions?.username} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex upload-center">
            <Form.Item
              name="avatar"
              noStyle
              initialValue={
                fetchUser?.data?.picture && {
                  path: fetchUser?.data?.picture,
                  url: fetchUser?.data?.avatar
                }
              }>
              <CustomUpload
                disabled={!fetchUser?.data?.permissions?.avatar}
                type="users"
                name="image"
                mode="single"
                typeFile="image"
                hasCrop
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            {role !== 6 && role !== 12 && role !== 10 ? (
              <Form.Item
                name="first_name"
                label={t('account_info.first_name')}
                initialValue={fetchUser?.data?.first_name || ''}>
                <Input disabled={!fetchUser?.data?.permissions?.first_name} />
              </Form.Item>
            ) : (
              <Form.Item name="name" label={t('account_info.name')} initialValue={fetchUser?.data?.name}>
                <Input disabled={!fetchUser?.data?.permissions?.name} />
              </Form.Item>
            )}
          </Col>
          {role !== 6 && role !== 12 && role !== 10 && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                name="last_name"
                label={t('account_info.last_name')}
                initialValue={fetchUser?.data?.last_name || ''}>
                <Input disabled={!fetchUser?.data?.permissions?.last_name} />
              </Form.Item>
            </Col>
          )}
          {role !== 6 && role !== 10 && role !== 12 && role !== 2 && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="birthday" label={t('account_info.birthday')} initialValue={fetchUser?.data?.birthday}>
                <DateTimePicker disabled={!fetchUser?.data?.permissions?.birthday} />
              </Form.Item>
            </Col>
          )}
          {role !== 6 && role !== 10 && role !== 12 && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="degree" label={t('account_info.degree')} initialValue={fetchUser?.data?.degree}>
                <Input disabled={!fetchUser?.data?.permissions?.degree} />
              </Form.Item>
            </Col>
          )}
          {(fetchUser?.data?.permissions?.password || !id) && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                name="password"
                label={t('account_info.password')}
                rules={[{pattern: passwordRegex, message: t('validation.correctPassword')}]}>
                <Input className="ltr-input" disabled={!fetchUser?.data?.permissions?.password} />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={12} lg={8}>
            <Form.Item name="mobile" label={t('account_info.mobile')} initialValue={fetchUser?.data?.mobile}>
              <Input
                inputMode="tel"
                minLength={11}
                maxLength={11}
                className="ltr-input"
                disabled={!fetchUser?.data?.permissions?.mobile}
              />
            </Form.Item>
          </Col>
          {role !== 6 && role !== 10 && role !== 12 && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="height" label={t('account_info.height')} initialValue={fetchUser?.data?.height}>
                <InputNumber type="number" className="w-full" disabled={!fetchUser?.data?.permissions?.height} />
              </Form.Item>
            </Col>
          )}
          {role === 4 && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="job" label={t('account_info.career')} initialValue={fetchUser?.data?.job}>
                <Input disabled={!fetchUser?.data?.permissions?.job} />
              </Form.Item>
            </Col>
          )}
          {(role === 4 || role === 2) && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label={t('account_info.national_code')}
                name="national_code"
                rules={[{len: 10, message: t('validation.nationalCode')}]}
                initialValue={fetchUser?.data?.national_code}>
                <Input type="number" className="ltr-input" minLength={10} maxLength={10} />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="email"
              rules={[{type: 'email', message: t('validation.email')}]}
              label={t('account_info.email')}
              initialValue={fetchUser?.data?.email || ''}>
              <Input type="email" className="ltr-input" disabled={!fetchUser?.data?.permissions?.email} />
            </Form.Item>
          </Col>
          {role !== 6 && role !== 10 && role !== 12 && (
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="weight" label={t('account_info.weight')} initialValue={fetchUser?.data?.weight}>
                <InputNumber type="number" className="w-full" disabled={!fetchUser?.data?.permissions?.weight} />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="language"
              label={t('account_info.language')}
              initialValue={fetchUser?.data?.language}
              rules={[{required: true, message: t('messages.required')}]}>
              <MultiSelect
                url="languages"
                urlName="languages"
                keyValue="name"
                keyLabel="name"
                disabled={!fetchUser?.data?.permissions?.language}
                isGeneral
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
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
                  <Form.Item name="country" initialValue={fetchUser?.data?.country}>
                    <MultiSelectPaginate
                      url="locations/paginate"
                      keyValue="id"
                      keyLabel="name"
                      urlName="locations_country"
                      disabled={!fetchUser?.data?.permissions?.city_id}
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
                  <Form.Item name="province" initialValue={fetchUser?.data?.province}>
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
                      disabled={!form.getFieldValue('country') && !fetchUser?.data?.permissions?.city_id}
                      dropDownWith={200}
                      placeholder={t('account_info.province')}
                      params={{parent_id: form.getFieldValue('country')?.id}}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="city" initialValue={fetchUser?.data?.city}>
                    <MultiSelectPaginate
                      url="locations/paginate"
                      keyValue="id"
                      keyLabel="name"
                      urlName="locations_city"
                      isGeneral
                      showSearch
                      dropDownWith={200}
                      disabled={!form.getFieldValue('province') && !fetchUser?.data?.permissions?.city_id}
                      placeholder={t('account_info.city')}
                      params={{parent_id: form.getFieldValue('province')?.id}}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} className="pl-0">
                  <Form.Item name="address" initialValue={fetchUser?.data?.address}>
                    <Input.TextArea
                      disabled={!fetchUser?.data?.permissions?.address}
                      placeholder={t('account_info.address')}
                      autoSize
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form.Item>
        </Row>
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="gender"
              label={t('account_info.sex')}
              className="text-center"
              initialValue={fetchUser?.data?.gender}>
              <Radio.Group disabled={!fetchUser?.data?.permissions?.gender}>
                <Radio value="male">{t('account_info.male')}</Radio>
                <Radio value="female">{t('account_info.female')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="marital_status"
              className="text-center"
              label={t('account_info.marital_status')}
              initialValue={fetchUser?.data?.marital_status}>
              <Radio.Group disabled={!fetchUser?.data?.permissions?.marital_status}>
                <Radio value="single">{t('account_info.single')}</Radio>
                <Radio value="married">{t('account_info.married')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={8} className="flex-center">
            <Form.Item name="status" valuePropName="checked" initialValue={fetchUser?.data?.status !== 'inactive'}>
              <Checkbox>{t('account_info.active')}</Checkbox>
            </Form.Item>
          </Col> */}
        </Row>
        {role === 2 && (
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Form.Item name="parents_id" label={t('account_info.clinics')} initialValue={fetchUser?.data?.parents}>
                <MultiSelectPaginate
                  mode="multiple"
                  url="users/clinics"
                  keyValue="id"
                  keyLabel="name"
                  keySubTitle="location"
                  urlName="clinics"
                  disabled={!fetchUser?.data?.permissions?.parents}
                  placeholder={t('account_info.not_selected_clinics')}
                  isGeneral
                  showSearch
                  showSubTitle
                  alignDropDownTop
                />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Form.Item name="note" label={t('account_info.note')} initialValue={fetchUser?.data?.note}>
              <Input.TextArea
                disabled={!fetchUser?.data?.permissions?.note}
                placeholder={t('account_info.empty')}
                rows={3}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label={t('account_info.description')}
              initialValue={fetchUser?.data?.description}>
              <Input.TextArea
                disabled={!fetchUser?.data?.permissions?.description}
                placeholder={t('account_info.empty')}
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="my-5">
          <Col span={24} className="flex flex-col sm:flex-row items-center justify-between">
            {userInstance.isMySelf(id) && (
              <Button
                type="primary"
                htmlType="button"
                className="ml-auto w-full sm:w-unset"
                loading={logOut.isLoading}
                icon={<LogoutOutlined />}
                onClick={logOut.logOut}
                danger>
                {t('account_info.logout')}
              </Button>
            )}
            <Button
              className="w-full sm:w-unset mr-auto my-4"
              type="primary"
              htmlType="submit"
              loading={updateUser.isLoading}
              icon={<SaveOutlined />}>
              {t('account_info.save')}
            </Button>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default AccountInfo;
