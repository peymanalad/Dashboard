import React, {FC} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox, Tag} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, DateTimePicker, MultiSelectPaginate} from 'components';
import {getImageUrl, wordCounter} from 'utils';

const {TextArea} = Input;

const EditNews: FC = () => {
  const {t} = useTranslation('news');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();

  const [form] = Form.useForm();

  const fetchNews = useFetch({
    name: ['news', id],
    url: 'services/app/Posts/GetPostForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeNews = usePost({
    url: '/services/app/Newss/CreateOrEdit',
    method: 'POST',
    removeQueries: ['news'],
    form,
    onSuccess: () => {
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace('/news/news/list');
    }
  });

  const onFinish = (values: any) => {
    values.postGroupId = values.postGroupId?.id;
    values.groupMemberId = values.groupMemberId?.id;
    values.postFileToken = values.postFileToken?.path;
    storeNews.post({id, ...values});
  };

  return (
    <Card
      title={id ? t('edit_news') : t('create_news')}
      loading={(id && !fetchNews?.data) || fetchNews.isFetching}
      bordered={false}
      className="w-full">
      <Form form={form} layout="vertical" name="product" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8} className="flex upload-center">
            <Form.Item
              name="postFileToken"
              noStyle
              initialValue={
                fetchNews?.data?.post?.postFile && {
                  path: fetchNews?.data?.post?.postFile,
                  url: getImageUrl(fetchNews?.data?.post?.postFile)
                }
              }>
              <CustomUpload type="products" name="image" mode="single" typeFile="image" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={16}>
            <Form.Item
              name="postTitle"
              label={t('title')}
              rules={[{required: true, message: t('messages.required')}]}
              initialValue={fetchNews?.data?.post?.postTitle || ''}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('news_group')}
              name="postGroupId"
              initialValue={{
                id: fetchNews?.data?.post?.postGroupId,
                displayName: fetchNews?.data?.postGroupPostGroupDescription
              }}>
              <MultiSelectPaginate
                mode="single"
                urlName="newsGroupSearch"
                url="services/app/Posts/GetAllPostGroupForLookupTable"
                keyValue="id"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label={t('news_user')}
              name="groupMemberId"
              initialValue={{
                id: fetchNews?.data?.post?.groupMemberId,
                displayName: fetchNews?.data?.groupMemberMemberPosition
              }}>
              <MultiSelectPaginate
                mode="single"
                urlName="groupMemberSearch"
                url="services/app/Posts/GetAllGroupMemberForLookupTable"
                keyValue="id"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full" justify="end">
          <Col span={24}>
            <Form.Item
              name="postCaption"
              label={t('context')}
              initialValue={fetchNews?.data?.post?.postCaption}
              rules={[{required: true, message: t('messages.required')}]}>
              <TextArea rows={7} />
            </Form.Item>
          </Col>
          <Form.Item noStyle shouldUpdate={(prevValues, nextValues) => prevValues?.content !== nextValues?.content}>
            {() => {
              const wordCount = wordCounter(form.getFieldValue('postCaption'));
              return (
                <Tag color={wordCount > 300 ? 'magenta' : wordCount > 200 ? 'green' : 'geekblue'}>{wordCount}</Tag>
              );
            }}
          </Form.Item>
        </Row>
        <Row gutter={[16, 8]} className="w-full">
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              name="postTime"
              initialValue={fetchNews?.data?.post?.postTime}
              rules={[{required: true, message: t('messages.date_time')}]}
              label={t('news_time')}>
              <DateTimePicker timePicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} className="flex align-center justify-center">
            <Form.Item
              name="isSpecial"
              valuePropName="checked"
              className="m-0"
              initialValue={fetchNews?.data?.post?.isSpecial}>
              <Checkbox>{t('special.title')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={storeNews.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EditNews;
