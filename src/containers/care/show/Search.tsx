import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {Button, Row, Form, Col, Input, InputNumber, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {MultiSelectPaginate, SimpleSelect} from 'components';
import {useTranslation} from 'react-i18next';
import {is_confirm_care, type} from 'assets';
import qs from 'qs';
import {useHistory, useLocation} from 'react-router-dom';
import {queryStringToObject} from 'utils';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchCare: ForwardRefRenderFunction<refProps, props> = (props: props, forwardedRef: ForwardedRef<refProps>) => {
  const {t} = useTranslation('care');
  const history = useHistory();

  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (values: any) => {
    values.parent_id = values?.disease?.id;
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
          <Form.Item name="id" label={t('id')} className="mb-1/2 label-p-0" initialValue={queryObject?.id}>
            <InputNumber className="w-full" type="number" placeholder={t('empty')} />
          </Form.Item>
          <Form.Item name="name" label={t('name')} className="mb-1/2 label-p-0" initialValue={queryObject?.name}>
            <Input placeholder={t('empty')} className="w-full" />
          </Form.Item>
          <Form.Item
            name="synonym_name"
            label={t('synonym_name')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.synonym_name}>
            <Input placeholder={t('empty')} className="w-full" />
          </Form.Item>
          <Form.Item name="icd" label="ICD" className="mb-1/2 label-p-0" initialValue={queryObject?.icd}>
            <Input placeholder={t('empty')} className="w-full" />
          </Form.Item>
          <Form.Item
            name="disease"
            label={t('category')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.disease}>
            <MultiSelectPaginate
              url="diseases/paginate"
              keyValue="id"
              keyLabel="name"
              urlName="parentDisease"
              allowClear
              placeholder={t('all')}
              params={{is_parent: 1}}
              alignDropDownTop
              isGeneral
              showSearch
            />
          </Form.Item>
          <Form.Item name="type" label={t('type')} className="mb-1/2 label-p-0" initialValue={queryObject?.type}>
            <SimpleSelect
              keys="name"
              label="name_fa"
              placeholder={t('all')}
              allowClear
              alignDropDownTop
              data={type?.map((value) => ({...value, name_fa: t(value?.name)}))}
            />
          </Form.Item>
          <Form.Item
            name="is_confirm"
            label={t('status')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.is_confirm}>
            <SimpleSelect
              keys="id"
              label="name_fa"
              placeholder={t('all')}
              alignDropDownTop
              allowClear
              data={is_confirm_care?.map((value) => ({...value, name_fa: t(value?.name)}))}
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
export default forwardRef(SearchCare);
