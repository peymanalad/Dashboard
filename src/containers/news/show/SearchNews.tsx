import React, {type FC, useState} from 'react';
import {Button, Row, Form, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined, FilterOutlined} from '@ant-design/icons';
import {DateTimePicker, MultiSelectPaginate} from 'components';
import {useTranslation} from 'react-i18next';
import {convertNumbers2English, convertTimeToUTC, queryStringToObject} from 'utils';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';

const SearchNews: FC = () => {
  const {t} = useTranslation('news');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);
  const organizationId = queryObject?.organizationId || queryObject?.organization?.id;

  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    if (values?.search?.length) values.search = convertNumbers2English(values?.search);
    values.FromDate = values.FromDate ? convertTimeToUTC(values.FromDate, 'YYYY-MM-DD') : undefined;
    values.ToDate = values.ToDate ? convertTimeToUTC(values.ToDate, 'YYYY-MM-DD') : undefined;
    values.PostGroupPostGroupDescriptionFilter = values?.postGroup?.displayName;
    history.replace({
      search: qs.stringify({...queryObject, ...values, page: 1})
    });
  };

  const showSearch = () => setVisible(true);
  const hasSearch: boolean =
    queryObject?.FromDate ||
    queryObject?.ToDate ||
    queryObject?.search ||
    queryObject?.PostGroupPostGroupDescriptionFilter ||
    queryObject?.PostTitleFilter ||
    queryObject?.PostCaptionFilter;

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
              name="search"
              label={t('advancedSearch')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.search}>
              <Input placeholder={t('searchOnAllParameters')} className="w-full" />
            </Form.Item>
            <Form.Item
              name="PostTitleFilter"
              label={t('name')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.PostTitleFilter}>
              <Input placeholder={t('empty')} className="w-full" />
            </Form.Item>
            <Form.Item
              name="PostCaptionFilter"
              label={t('context')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.PostCaptionFilter}>
              <Input placeholder={t('empty')} className="w-full" />
            </Form.Item>
            <Form.Item
              name="postGroup"
              label={t('news_group')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.postGroup}>
              <MultiSelectPaginate
                mode="single"
                urlName={['newsGroupSearch', organizationId || 'all']}
                url="services/app/Posts/GetAllPostGroupForLookupTable"
                params={{organizationId}}
                keyValue="id"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch={false}
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="FromDate"
              label={t('from_date')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.FromDate}>
              <DateTimePicker />
            </Form.Item>
            <Form.Item
              name="ToDate"
              label={t('to_date')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.ToDate}>
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
export default SearchNews;
