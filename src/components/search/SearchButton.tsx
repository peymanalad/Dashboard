import React, {type FC, ReactNode, useState} from 'react';
import {Button, Row, Form, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {convertNumbers2English, queryStringToObject} from 'utils';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';

interface props {
  name?: string;
  onSearch?(values: any): any;
  children?: (queryObject: any) => ReactNode;
}

const SearchButton: FC<props> = ({name = 'search', onSearch, children}) => {
  const {t} = useTranslation('general');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    if (values[name]?.length) values[name] = convertNumbers2English(values?.[name]);
    if (onSearch) values = onSearch(values);
    history.replace({
      search: qs.stringify({...queryObject, ...values, page: 1})
    });
  };

  const showSearch = () => setVisible(true);
  const searchValue = queryObject?.[name];
  const hasSearch: boolean = !!searchValue || queryObject?.ToDate || queryObject?.FromDate;

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
            <Form.Item name={name} label={t('advancedSearch')} className="mb-1/2 label-p-0" initialValue={searchValue}>
              <Input placeholder={t('searchOnAllParameters')} className="w-full" />
            </Form.Item>
            {children ? children(queryObject) : null}
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
                  history.replace({[name]: ''});
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
            history.replace({[name]: ''});
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
export default SearchButton;
