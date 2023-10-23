import React, {FC, useState} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox, Tag, Modal} from 'antd';
import {SaveOutlined, SearchOutlined, SmileOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch} from 'hooks';
import {CustomUpload, MultiSelectPaginate} from 'components';
import {getImageUrl, wordCounter} from 'utils';
import compact from 'lodash/compact';
import {Picker} from 'emoji-mart';

const {TextArea} = Input;

const EditNews: FC = () => {
  const {t} = useTranslation('news');
  const history = useHistory();
  const {id} = useParams<{id?: string}>();
  const [showEmoji, setShowEmoji] = useState<boolean>();
  const [contentPos, setContentPos] = useState<number>(0);

  const [form] = Form.useForm();

  const fetchNews = useFetch({
    name: ['news', id],
    url: 'services/app/Posts/GetPostForEdit',
    query: {Id: id},
    enabled: !!id
  });

  const storeNews = usePost({
    url: '/services/app/Posts/CreateOrEdit',
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
    values.postFile2 = values.postFileToken?.[1]?.fileToken;
    values.postFileToken2 = values.postFileToken?.[1]?.response?.fileToken;
    values.postFile3 = values.postFileToken?.[2]?.fileToken;
    values.postFileToken3 = values.postFileToken?.[2]?.response?.fileToken;
    values.postFile = values.postFileToken?.[0]?.fileToken;
    values.postFileToken = values.postFileToken?.[0]?.response?.fileToken;
    storeNews.post({id: id ? +id : undefined, ...values});
  };

  const onChangePosition = (e: any) => {
    setContentPos(e.target.selectionStart);
  };

  const emojiSelect = (emoji: any) => {
    const des = form.getFieldValue('postCaption');
    const pos = contentPos;
    const addData = emoji?.native;
    form.setFieldValue('postCaption', des?.slice(0, pos) + addData + des?.slice(pos));
  };

  return (
    <>
      <Card
        title={id ? t('edit_news') : t('create_news')}
        loading={(id && !fetchNews?.data) || fetchNews.isFetching}
        bordered={false}
        className="w-full">
        <Form form={form} layout="vertical" name="product" requiredMark={false} onFinish={onFinish}>
          <Row gutter={[16, 8]} className="w-full">
            <Col xs={24} md={16}>
              <Form.Item
                name="postTitle"
                label={t('title')}
                rules={[{required: true, message: t('messages.required')}]}
                initialValue={fetchNews?.data?.post?.postTitle || ''}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
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
          </Row>
          <Row gutter={[16, 8]} className="w-full">
            <Col xs={24} md={16}>
              <Form.Item
                name="postFileToken"
                noStyle
                initialValue={compact([
                  fetchNews?.data?.post?.postFile
                    ? {
                        fileToken: fetchNews?.data?.post?.postFile,
                        url: getImageUrl(fetchNews?.data?.post?.postFile)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile2
                    ? {
                        fileToken: fetchNews?.data?.post?.postFile2,
                        url: getImageUrl(fetchNews?.data?.post?.postFile2)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile3
                    ? {
                        fileToken: fetchNews?.data?.post?.postFile3,
                        url: getImageUrl(fetchNews?.data?.post?.postFile3)
                      }
                    : null
                ])}>
                <CustomUpload
                  type="posts"
                  name={t('file')}
                  mode="multiple"
                  maxFile={3}
                  typeFile="image,video"
                  hasCrop
                  aspect={1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={4} className="flex align-center justify-center">
              <Form.Item
                name="isSpecial"
                valuePropName="checked"
                className="m-0"
                initialValue={fetchNews?.data?.post?.isDraft}>
                <Checkbox>{t('special.title')}</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={4} className="flex align-center justify-center">
              <Form.Item
                name="isPublished"
                valuePropName="checked"
                className="m-0"
                initialValue={fetchNews?.data?.post?.isPublished}>
                <Checkbox>{t('publish.title')}</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row className="flex-center w-full flex-col" />
          <Row gutter={[16, 8]} className="w-full" justify="end">
            <Col span={24}>
              <Form.Item
                name="postCaption"
                label={t('context')}
                initialValue={fetchNews?.data?.post?.postCaption}
                rules={[{required: true, message: t('messages.required')}]}>
                <TextArea rows={7} onChangeCapture={onChangePosition} onClick={onChangePosition} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" align="middle">
            <Col>
              <Button
                onClick={() => {
                  setShowEmoji(true);
                }}
                className="d-none md:d-block mx-4"
                type="text"
                icon={<SmileOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: 18}} />}
              />
            </Col>
            <Form.Item noStyle shouldUpdate={(prevValues, nextValues) => prevValues?.content !== nextValues?.content}>
              {() => {
                const wordCount = wordCounter(form.getFieldValue('postCaption'));
                return (
                  <Col>
                    <Tag color={wordCount > 300 ? 'magenta' : wordCount > 200 ? 'green' : 'geekblue'}>{wordCount}</Tag>
                  </Col>
                );
              }}
            </Form.Item>
            <Col xs={24}>
              <Input.Group compact className="flex-center">
                <Form.Item
                  name="postRefLink"
                  label={t('link')}
                  style={{width: '80%'}}
                  rules={[{type: 'url', message: t('messages.url')}]}
                  initialValue={fetchNews?.data?.post?.postRefLink}>
                  <Input className="ltr-input rounded-l-none" dir="ltr" style={{marginBottom: '6px'}} />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, nextValues) => prevValues?.postRefLink !== nextValues?.postRefLink}>
                  {() => (
                    <Button
                      type="primary"
                      className="d-text-none lg:d-text-unset"
                      style={{width: '20%'}}
                      disabled={!form.getFieldValue('postRefLink')?.length}
                      icon={<SearchOutlined />}
                      onClick={() => {
                        window.open(form.getFieldValue('postRefLink'));
                      }}>
                      {t('goto_link')}
                    </Button>
                  )}
                </Form.Item>
              </Input.Group>
            </Col>
          </Row>
          <Row gutter={[16, 8]} className="my-5">
            <Button
              className="sm:w-unset mr-auto my-4"
              type="primary"
              htmlType="submit"
              loading={storeNews.isLoading}
              icon={<SaveOutlined />}>
              {t('save')}
            </Button>
          </Row>
        </Form>
      </Card>
      <Modal
        visible={showEmoji}
        closable={false}
        width={300}
        className="not-body-modal"
        onCancel={() => {
          setShowEmoji(false);
        }}
        footer={null}>
        <Picker
          set="apple"
          enableFrequentEmojiSort
          showPreview={false}
          onSelect={emojiSelect}
          i18n={t('emojis', {returnObjects: true})}
        />
      </Modal>
    </>
  );
};

export default EditNews;
