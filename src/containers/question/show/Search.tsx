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
import {DrillDownSelectPaginate, MultiSelectPaginate, SimpleSelect} from 'components';
import {useTranslation} from 'react-i18next';
import {searchOptionsProps} from 'types/question';
import {QuestionChartType, QuestionStatus, QuestionType} from 'assets';
import qs from 'qs';
import {useHistory, useLocation} from 'react-router-dom';
import {queryStringToObject} from 'utils';
import map from 'lodash/map';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchQuestion: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const history = useHistory();
  const {t} = useTranslation('question');
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (value: searchOptionsProps) => {
    value.diseases_id = map(value.diseases, 'id');
    value.group_id = value?.group?.id;
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
          <Form.Item name="id" label={t('id')} className="mb-1/2 label-p-0" initialValue={queryObject?.id}>
            <InputNumber className="w-full" type="number" placeholder={t('empty')} />
          </Form.Item>
          <Form.Item name="title" label={t('title')} className="mb-1/2 label-p-0" initialValue={queryObject?.title}>
            <Input placeholder={t('empty')} />
          </Form.Item>
          <Form.Item
            name="chart_type"
            label={t('chart')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.chart_type}>
            <SimpleSelect keys="id" label="name" placeholder={t('empty')} allowClear data={QuestionChartType} />
          </Form.Item>
          <Form.Item
            name="is_active"
            label={t('status')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.is_active}>
            <SimpleSelect keys="id" label="name" placeholder={t('empty')} allowClear data={QuestionStatus} />
          </Form.Item>
          <Form.Item
            name="type"
            label={t('type_question')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.type}>
            <SimpleSelect
              keys="name"
              label="name_fa"
              placeholder={t('empty')}
              allowClear
              alignDropDownTop
              data={map(QuestionType, (value) => ({...value, name_fa: t(value?.name)}))}
            />
          </Form.Item>
          <Form.Item name="group" label={t('group')} className="mb-1/2 label-p-0" initialValue={queryObject?.group}>
            <MultiSelectPaginate
              url="question_groups/paginate"
              keyValue="id"
              keyLabel="title"
              urlName="question_groups"
              placeholder={t('all')}
              alignDropDownTop
              isGeneral
              showSearch
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="diseases"
            label={t('care')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.diseases}>
            <DrillDownSelectPaginate
              url="diseases/children"
              urlName="Diseases"
              keyLabel="name"
              keyValue="id"
              title={t('care')}
              placeholder={t('all')}
              mode="multiple"
              isGeneral
              showSearch
              allowClear
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
export default forwardRef(SearchQuestion);
