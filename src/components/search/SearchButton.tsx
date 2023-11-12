import React, {type FC, useState} from 'react';
import {Button, Row, Form, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined, FilterOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {convertNumbers2English, queryStringToObject} from 'utils';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';

interface props {
  name?: string;
}

const SearchButton: FC<props> = ({name = 'search'}) => {
  const {t} = useTranslation('general');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    history.replace({
      search: qs.stringify({[name]: convertNumbers2English(values?.[name])})
    });
  };

  const showSearch = () => setVisible(true);
  const searchValue = queryObject?.[name];

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
      {!!searchValue && (
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
