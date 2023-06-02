import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {Button, Row, Form, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {MultiSelectPaginate, SimpleSelect} from 'components';
import {useTranslation} from 'react-i18next';
import {searchOptionsProps} from 'types/product';
import {is_active} from 'assets';
import {queryStringToObject} from 'utils';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';
import map from 'lodash/map';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchProduct: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('products');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (value: searchOptionsProps) => {
    value.provider_id = value?.provider?.id;
    history.replace({
      search: qs.stringify(value)
    });
  };

  useImperativeHandle(forwardedRef, () => ({
    open() {
      setVisible(true);
    },
    close() {
      setVisible(false);
    }
  }));

  return (
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
          <Form.Item name="name" label={t('name')} className="mb-1/2 label-p-0" initialValue={queryObject?.name}>
            <Input className="w-full" placeholder={t('empty')} />
          </Form.Item>
          <Form.Item
            name="provider"
            label={t('provider')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.provider}>
            <MultiSelectPaginate
              url="users/providers"
              keyValue="id"
              keyLabel="name"
              hasImage
              keyImage="avatar"
              urlName="providers"
              placeholder={t('all')}
              isGeneral
              showSearch
            />
          </Form.Item>
          <Form.Item
            name="is_active"
            label={t('status')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.is_active}>
            <SimpleSelect
              keys="id"
              label="name_fa"
              placeholder={t('all')}
              allowClear
              alignDropDownTop
              data={map(is_active, (value) => ({...value, name_fa: t(value?.name)}))}
            />
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
                history.replace({search: ''});
                setVisible(false);
              }}
              icon={<CloseOutlined />}>
              {t('delete')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
export default forwardRef(SearchProduct);
