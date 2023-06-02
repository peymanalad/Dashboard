import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Button, Form, Row, Col, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {DateTimePicker} from 'components';
import {convertTimeToUTC, queryStringToObject} from 'utils';
import qs from 'qs';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchFactor: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const history = useHistory();
  const {t} = useTranslation('factor');
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (value: any) => {
    value.from_date = value.from_date ? convertTimeToUTC(value.from_date, 'YYYY-MM-DD') : undefined;
    value.to_date = value.to_date ? convertTimeToUTC(value.to_date, 'YYYY-MM-DD') : undefined;
    history.replace({
      search: qs.stringify(value)
    });
    setVisible(false);
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
          <Form.Item
            name="from_date"
            label={t('from_date')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.from_date}>
            <DateTimePicker />
          </Form.Item>
          <Form.Item
            name="to_date"
            label={t('to_date')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.to_date}>
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

export default forwardRef(SearchFactor);
