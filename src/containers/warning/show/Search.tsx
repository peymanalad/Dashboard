import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {DateTimePicker} from 'components';
import {Button, Row, Form, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {convertTimeToUTC, queryStringToObject} from 'utils';
import qs from 'qs';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchWarning: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('warning');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    if (values.created_at) values.created_at = convertTimeToUTC(values.created_at, 'YYYY-MM-DD');
    history.replace({
      search: qs.stringify(values)
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
      title={t('filter')}
      closable
      width={350}
      contentWrapperStyle={{maxWidth: '100vw'}}
      placement="left"
      onClose={() => {
        setVisible(false);
      }}
      visible={visible}>
      <Form className="pb-10" layout="vertical" onFinish={onFinish}>
        <Row gutter={24} className="px-8">
          <Form.Item name="full_name" label={t('name')} className="w-full" initialValue={queryObject?.full_name}>
            <Input placeholder={t('empty')} className="w-full" />
          </Form.Item>
        </Row>
        <Row gutter={24} className="px-8">
          <Form.Item name="created_at" label={t('date')} className="w-full" initialValue={queryObject?.created_at}>
            <DateTimePicker />
          </Form.Item>
        </Row>
        <Row gutter={24} className="flex flex-col sm:flex-row items-center justify-between">
          <Col xs={24} sm={12} className="w-full">
            <Button type="primary" htmlType="submit" className="w-full" icon={<SearchOutlined />}>
              {t('search')}
            </Button>
          </Col>
          <Col xs={24} sm={12} className="w-full my-4">
            <Button
              className="ant-btn-secondary w-full"
              type="primary"
              onClick={() => {
                history.replace({search: ''});
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
export default forwardRef(SearchWarning);
