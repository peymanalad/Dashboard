import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  ForwardedRef,
  ForwardRefRenderFunction,
  RefObject
} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Form, Row, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {queryStringToObject} from 'utils';
import qs from 'qs';
import {useHistory, useLocation} from 'react-router-dom';
import {ConfigSearch} from 'types/setting';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchParcel: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const history = useHistory();
  const {t} = useTranslation('setting');
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState<boolean>(false);

  const onFinish = (value: ConfigSearch) => {
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
          <Form.Item name="key" label={t('key')} className="mb-1/2 label-p-0" initialValue={queryObject?.key}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label={t('name')} className="mb-1/2 label-p-0" initialValue={queryObject?.name}>
            <Input />
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

export default forwardRef(SearchParcel);
