import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {Button, Row, Form, Col, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {DrillDownSelectPaginate, MultiSelectPaginate, SimpleSelect} from 'components';
import {useTranslation} from 'react-i18next';
import {RecommendationLog} from 'assets';
import {queryStringToObject} from 'utils';
import map from 'lodash/map';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchRecommendationLog: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('recommendation');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    values.doctor_id = values?.doctor?.id;
    values.disease_id = values?.disease?.id;
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
          <Form.Item name="doctor" label={t('doctor')} className="mb-1/2 label-p-0" initialValue={queryObject?.doctor}>
            <MultiSelectPaginate
              url="users/doctors"
              keyValue="id"
              keyLabel="full_name"
              urlName="doctors"
              isGeneral
              showSearch
              dropDownWith
              className="w-64"
              allowClear
              placeholder={t('doctor')}
            />
          </Form.Item>
          <Form.Item
            name="disease"
            label={t('disease_plan')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.disease}>
            <DrillDownSelectPaginate
              title={t('disease_plan')}
              placeholder={t('all')}
              mode="single"
              notSelectParent
              notSelectChild={false}
              url="diseases/children"
              urlName="diseases"
              isGeneral
              keyLabel="name"
              keyValue="id"
              showSearch
            />
          </Form.Item>
          <Form.Item name="type" label={t('type')} className="mb-1/2 label-p-0" initialValue={queryObject?.type}>
            <SimpleSelect
              keys="name"
              label="name_fa"
              placeholder={t('all')}
              allowClear
              data={map(RecommendationLog, (value) => ({...value, name_fa: t(value?.name)}))}
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
export default forwardRef(SearchRecommendationLog);
