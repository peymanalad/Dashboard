import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Form, Row, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {MultiSelectPaginate, SimpleSelect} from 'components';
import {ticketStatus} from 'assets';
import map from 'lodash/map';
import qs from 'qs';
import {queryStringToObject} from 'utils';
import {useHistory, useLocation} from 'react-router-dom';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchTicket: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('message');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (value: any) => {
    value.doctor_id = value?.doctor?.id;
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
            name="patient_id"
            label={t('patient_id')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.patient_id}>
            <Input className="w-full" />
          </Form.Item>
          <Form.Item name="doctor" label={t('doctor')} className="mb-1/2 label-p-0" initialValue={queryObject?.doctor}>
            <MultiSelectPaginate
              url="users/doctors"
              keyValue="name"
              keyLabel="full_name"
              urlName="doctors"
              isGeneral
              showSearch
              dropDownWith
              className="w-64"
              allowClear
              placeholder={t('all')}
            />
          </Form.Item>
          <Form.Item name="status" label={t('status')} className="mb-1/2 label-p-0" initialValue={queryObject?.status}>
            <SimpleSelect
              keys="id"
              label="name_fa"
              placeholder={t('all')}
              allowClear
              alignDropDownTop
              data={map(ticketStatus, (value) => ({...value, name_fa: t(value?.name)}))}
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

export default forwardRef(SearchTicket);
