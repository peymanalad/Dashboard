import React, {type FC, useState} from 'react';
import {Button, Row, Form, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined, FilterOutlined} from '@ant-design/icons';
import {DateTimePicker, MultiSelectPaginate} from 'components';
import {useTranslation} from 'react-i18next';
import {convertNumbers2English, convertTimeToUTC, queryStringToObject} from 'utils';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';

const SearchUsers: FC = () => {
  const {t} = useTranslation('user-show');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    // if (values?.search?.length) values[name] = convertNumbers2English(values?.[name]);
    values.FromCreationDate = values.FromCreationDate
      ? convertTimeToUTC(values.FromCreationDate, 'YYYY-MM-DD')
      : undefined;
    values.ToCreationDate = values.ToCreationDate ? convertTimeToUTC(values.ToCreationDate, 'YYYY-MM-DD') : undefined;
    values.FromLastLoginDate = values.FromLastLoginDate
      ? convertTimeToUTC(values.FromLastLoginDate, 'YYYY-MM-DD')
      : undefined;
    values.ToLastLoginDate = values.ToLastLoginDate
      ? convertTimeToUTC(values.ToLastLoginDate, 'YYYY-MM-DD')
      : undefined;
    values.role = values?.roles?.id;
    history.replace({
      search: qs.stringify({...queryObject, ...values})
    });
  };

  const showSearch = () => setVisible(true);
  const hasSearch: boolean =
    queryObject?.FromCreationDate ||
    queryObject?.ToCreationDate ||
    queryObject?.FromLastLoginDate ||
    queryObject?.ToLastLoginDate ||
    !!queryObject?.structSearch?.values?.length;

  return (
    <>
      <Drawer
        title={t('search')}
        closable
        width={350}
        contentWrapperStyle={{maxWidth: '100vw'}}
        bodyStyle={{padding: 5, paddingBottom: 0}}
        placement="left"
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}>
        <Form layout="vertical" className="h-full relative" onFinish={onFinish}>
          <Row className="d-block h-full overflow-auto px-4 pb-24">
            <Form.Item
              name={['structSearch', 'name']}
              label={t('name')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.structSearch?.name}>
              <Input placeholder={t('empty')} className="w-full" />
            </Form.Item>
            <Form.Item
              name={['structSearch', 'surname']}
              label={t('last_name')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.structSearch?.surname}>
              <Input placeholder={t('empty')} className="w-full" />
            </Form.Item>
            <Form.Item
              name="roles"
              label={t('access_level')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.roles}>
              <MultiSelectPaginate
                mode="single"
                urlName="roles"
                url="services/app/Role/GetListOfRoles"
                keyValue="id"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch={false}
                allowClear
              />
            </Form.Item>
            <Form.Item
              name={['structSearch', 'mobile']}
              label={t('mobile')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.structSearch?.mobile}>
              <Input placeholder={t('empty')} className="w-full" />
            </Form.Item>
            <Form.Item
              name={['structSearch', 'username']}
              label={t('username')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.structSearch?.username}>
              <Input type="single" className="w-full" placeholder={t('empty')} />
            </Form.Item>
            <Form.Item
              name="FromCreationDate"
              label={t('from_creation_date')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.FromCreationDate}>
              <DateTimePicker />
            </Form.Item>
            <Form.Item
              name="ToCreationDate"
              label={t('to_creation_date')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.ToCreationDate}>
              <DateTimePicker />
            </Form.Item>
            <Form.Item
              name="FromLastLoginDate"
              label={t('from_last_login_date')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.FromLastLoginDate}>
              <DateTimePicker />
            </Form.Item>
            <Form.Item
              name="ToLastLoginDate"
              label={t('to_last_login_date')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.ToLastLoginDate}>
              <DateTimePicker />
            </Form.Item>
          </Row>
          <Row
            gutter={24}
            className="flex flex-col sm:flex-row items-center justify-between w-full m-0 absolute bottom-0">
            <Col xs={24} sm={12} className="w-full">
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} className="w-full">
                {t('search')}
              </Button>
            </Col>
            <Col xs={24} sm={12} className="flex justify-end items-center w-full my-4">
              <Button
                className="ant-btn-secondary w-full"
                type="primary"
                onClick={() => {
                  history.replace({});
                  setVisible(false);
                }}
                icon={<CloseOutlined />}>
                {t('deleteFilter')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
      {hasSearch && (
        <Button
          className="d-text-none md:d-text-unset ant-btn-secondary ml-2"
          type="primary"
          onClick={() => {
            history.replace({});
            setVisible(false);
          }}
          icon={<CloseOutlined />}>
          {t('deleteFilter')}
        </Button>
      )}
      <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
        {t('filter')}
      </Button>
    </>
  );
};
export default SearchUsers;
