import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Form, Row, Col, Input, Drawer, Checkbox} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {DateTimePicker, MultiSelectPaginate, SimpleSelect} from 'components';
import {convertTimeToUTC, queryStringToObject} from 'utils';
import {orderStatus} from 'assets';
import qs from 'qs';
import map from 'lodash/map';
import {useHistory, useLocation} from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

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
    value.created_at = value.created_at ? convertTimeToUTC(value.created_at, 'YYYY-MM-DD') : undefined;
    value.has_coupon = value?.has_coupon ? 1 : undefined;
    value.user_id = !isEmpty(value?.user_id) ? value?.user_id : undefined;
    value.coupon_id = value?.coupon_id || undefined;
    value.doctor && (value.doctor_id = value.doctor.id);
    value.clinic && (value.clinic_id = value.clinic.id);
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
            name="user_id"
            label={t('status.user_id')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.user_id}>
            <Input type="number" className="ltr-input" />
          </Form.Item>
          <Form.Item name="clinic" label={t('clinic')} className="mb-1/2 label-p-0">
            <MultiSelectPaginate
              url="users/clinics"
              urlName="users_clinics"
              keyLabel="name"
              showSearch
              keyValue="id"
              isGeneral
              placeholder={t('choose')}
            />
          </Form.Item>
          <Form.Item name="doctor" label={t('doctor')} className="mb-1/2 label-p-0">
            <MultiSelectPaginate
              url="users/doctors"
              urlName="users_doctors"
              keyLabel="full_name"
              showSearch
              keyValue="id"
              isGeneral
              placeholder={t('choose')}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label={t('status.title')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.status}>
            <SimpleSelect
              keys="name"
              label="name_fa"
              placeholder={t('all')}
              allowClear
              data={map(orderStatus, (value) => ({...value, name_fa: t(`status.${value?.name}`)}))}
            />
          </Form.Item>
          <Form.Item name="has_coupon" valuePropName="checked" className="my-4" initialValue={queryObject?.has_coupon}>
            <Checkbox>{t('hasUseCoupon')}</Checkbox>
          </Form.Item>
          <Form.Item
            name="coupon_id"
            label={t('usedCouponCode')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.coupon_id}>
            <Input className="ltr-input" />
          </Form.Item>
          <Form.Item
            name="created_at"
            label={t('created_at')}
            className="w-full"
            initialValue={queryObject?.created_at}>
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
