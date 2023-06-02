import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Form, Row, Col, InputNumber, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {DateTimePicker, MultiSelectPaginate, SimpleSelect} from 'components';
import {queryStringToObject} from 'utils';
import {visitStatus} from 'assets';
import qs from 'qs';
import {useHistory, useLocation} from 'react-router-dom';
import {searchOptionsProps} from 'types/visit';
import map from 'lodash/map';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchVisit: ForwardRefRenderFunction<refProps, props> = (props: props, forwardedRef: ForwardedRef<refProps>) => {
  const {t} = useTranslation('visit');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);
  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    values.clinic_id = values?.clinic?.id;
    values.doctor_id = values?.doctor?.id;
    if (values.disease) {
      values.disease_id = values.disease.id;
    }
    history.replace({
      search: qs.stringify(values)
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
          <Form.Item name="id" label={t('visit_id')} className="mb-1/2 label-p-0" initialValue={queryObject?.id}>
            <InputNumber className="w-full" type="number" />
          </Form.Item>
          <Form.Item
            name="user_id"
            label={t('user_id')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.user_id}>
            <InputNumber className="w-full" type="number" />
          </Form.Item>

          <Form.Item name="status" label={t('status')} className="mb-1/2 label-p-0" initialValue={queryObject?.status}>
            <SimpleSelect
              keys="name"
              label="name_fa"
              placeholder={t('status')}
              allowClear
              data={map(visitStatus, (value) => ({...value, name_fa: t(value?.name)}))}
            />
          </Form.Item>
          <Form.Item name="clinic" label={t('clinic')} className="mb-1/2 label-p-0">
            <MultiSelectPaginate
              url="users/clinics"
              keyValue="id"
              keyLabel="name"
              urlName="clinics"
              isGeneral
              showSearch
              alignDropDownTop
              className="w-64"
              allowClear
              placeholder={t('clinic')}
            />
          </Form.Item>
          <Form.Item name="doctor" label={t('doctor')} className="mb-1/2 label-p-0" initialValue={queryObject?.doctor}>
            <MultiSelectPaginate
              url="users/doctors"
              keyValue="id"
              keyLabel="full_name"
              urlName="doctors"
              isGeneral
              showSearch
              alignDropDownTop
              className="w-64"
              allowClear
              placeholder={t('doctor')}
            />
          </Form.Item>
          <Form.Item
            name="disease"
            label={t('education_care')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.disease}>
            <MultiSelectPaginate
              mode="single"
              url="diseases/paginate"
              keyValue="id"
              keyLabel="name"
              urlName="parentDisease"
              allowClear
              placeholder={t('choose')}
              isGeneral
              showSearch
            />
          </Form.Item>

          <Form.Item
            name="created_at"
            label={t('date')}
            className="mb-1/2 label-p-0"
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

export default forwardRef(SearchVisit);
