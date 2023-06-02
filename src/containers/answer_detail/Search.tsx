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
import {DateTimePicker, MultiSelectPaginate, SimpleSelect} from 'components';
import {useTranslation} from 'react-i18next';
import {queryStringToObject} from 'utils';
import {AnsweredType} from 'assets';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';
import map from 'lodash/map';
import {AnswerDetailStatus, AnswerDetailType} from 'assets/constants/Questions';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchAnswer: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('question');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    values.question_group_id = values?.question_group?.id;
    values.question_id = map(values?.questions, 'id');
    values.doctor_id = values?.doctor?.id;
    values.user_id = values?.user?.id;
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
          {/* <Form.Item name="user_id" label={t('user_id')} className="mb-1/2 label-p-0">
            <Input />
          </Form.Item> */}
          <Form.Item name="user" label={t('user')} className="mb-1/2 label-p-0" initialValue={queryObject?.user}>
            <MultiSelectPaginate
              url="users/patients"
              keyValue="id"
              keyLabel="full_name"
              urlName="users"
              placeholder={t('all')}
              isGeneral
              showSearch
            />
          </Form.Item>
          <Form.Item name="doctor" label={t('doctor')} className="mb-1/2 label-p-0" initialValue={queryObject?.doctor}>
            <MultiSelectPaginate
              url="users/doctors"
              keyValue="id"
              keyLabel="full_name"
              urlName="doctors"
              placeholder={t('all')}
              isGeneral
              showSearch
            />
          </Form.Item>
          <Form.Item
            name="reviewed"
            label={t('answer_status')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.reviewed}>
            <SimpleSelect keys="value" label="name" placeholder={t('all')} allowClear data={AnswerDetailStatus} />
          </Form.Item>
          <Form.Item name="type" label={t('answer_type')} className="mb-1/2 label-p-0" initialValue={queryObject?.type}>
            <SimpleSelect keys="value" label="name" placeholder={t('all')} allowClear data={AnswerDetailType} />
          </Form.Item>
          <Form.Item
            name="created_from"
            label={t('created_from')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.created_from}>
            <DateTimePicker />
          </Form.Item>
          <Form.Item
            name="created_to"
            label={t('created_to')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.created_to}>
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
export default forwardRef(SearchAnswer);
