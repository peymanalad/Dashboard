import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {Button, Row, Form, Col, Input, Drawer} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {DateTimePicker, DrillDownSelectPaginate, MultiSelectPaginate, SimpleSelect} from 'components';
import {pictureStatus} from 'assets';
import {useTranslation} from 'react-i18next';
import qs from 'qs';
import {queryStringToObject} from 'utils';
import {searchOptionsProps} from 'types/recommendation';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchRecommendation: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('recommendation');
  const history = useHistory();
  const queryObject = queryStringToObject(useLocation().search);

  const [visible, setVisible] = useState(false);

  const onFinish = (value: searchOptionsProps) => {
    value.disease_id = value?.disease?.id;
    value.subject && (value.subject_id = value.subject.id);
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
          <Form.Item name="id" label={t('id')} className="mb-1/2 label-p-0" initialValue={queryObject?.id}>
            <Input placeholder={t('search_id')} className="w-full" />
          </Form.Item>
          <Form.Item
            name="disease"
            label={t('disease_plan')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.disease}>
            <DrillDownSelectPaginate
              title={t('disease_plan')}
              mode="single"
              notSelectParent
              notSelectChild={false}
              placeholder={t('all')}
              url="diseases/children"
              urlName="diseases"
              isGeneral
              keyLabel="name"
              keyValue="id"
              showSearch
            />
          </Form.Item>
          <Form.Item
            name="title"
            label={t('title_rcmd')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.title}>
            <Input placeholder={t('search_title')} />
          </Form.Item>
          <Form.Item
            name="content"
            label={t('content')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.content}>
            <Input placeholder={t('search_content')} />
          </Form.Item>
          <Form.Item
            label={t('subject')}
            name="subject"
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.subject}>
            <MultiSelectPaginate
              url="subjects/paginate"
              keyValue="id"
              keyLabel="title"
              placeholder={t('choose')}
              urlName="subjects"
              isGeneral
              showSearch
            />
          </Form.Item>
          <Form.Item
            name="created_at"
            label={t('created_at')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.content}>
            <DateTimePicker />
          </Form.Item>
          <Form.Item
            name="has_image"
            label={t('pictureStatus.title')}
            className="w-full mb-1/2 label-p-0"
            initialValue={queryObject?.has_image}>
            <SimpleSelect keys="id" label="name" placeholder={t('all')} data={pictureStatus} allowClear />
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
export default forwardRef(SearchRecommendation);
