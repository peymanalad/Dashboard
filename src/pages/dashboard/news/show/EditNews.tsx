import React, {FC, useMemo, useState} from 'react';
import {Card, Form, Row, Col, Input, Button, Checkbox, Tag, Modal} from 'antd';
import {SearchOutlined, SmileOutlined} from '@ant-design/icons';
import {useHistory, useParams, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {usePost, useFetch, useUser} from 'hooks';
import {CustomUpload, FormActions, MultiSelectPaginate} from 'components';
import SelectOrganization from 'containers/organization/SelectOrganization';
import {getImageUrl, wordCounter} from 'utils';
import compact from 'lodash/compact';
import {Picker} from 'emoji-mart';
import {v4 as uuidv4} from 'uuid';
import {queryStringToObject} from 'utils';
import {UserTypeEnum} from 'types/user';
import {PostStatusEnum} from 'types/news';

const {TextArea} = Input;

const EditNews: FC = () => {
  const {t} = useTranslation('news');
  const {isNewsPublisher, id: userId, getUserType} = useUser();
  const isPublisher = isNewsPublisher();
  const userType = getUserType();
  const history = useHistory();
  const location = useLocation<any>();
  const {id} = useParams<{id?: string}>();
  const [isUploading, setIsUploading] = useState<boolean>();
  const [showEmoji, setShowEmoji] = useState<boolean>();
  const [contentPos, setContentPos] = useState<number>(0);
  const queryObject = queryStringToObject(location.search);

  const postKey = useMemo(() => uuidv4(), []);

  const [form] = Form.useForm();

  const onBack = () => {
    if (history.length > 1 && document.URL !== document.referrer) history.goBack();
    else history.replace('/news/news/list');
  };

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
    showError: false,
    form,
    retry: 3,
    onSuccess: onBack,
    onError: onBack
  });

  const onFinish = (values: any) => {
    values.postKey = postKey;
    values.postGroupId = values.postGroupId?.id;
    values.postSubGroupId = values.postSubGroupId?.postSubGroup?.id;
    values.groupMemberId = fetchNews?.data?.post?.groupMemberId;
    values.postFile2 = values.postFileToken?.[1]?.fileToken;
    values.postFileToken2 = values.postFileToken?.[1]?.response?.fileToken;
    values.postFile3 = values.postFileToken?.[2]?.fileToken;
    values.postFileToken3 = values.postFileToken?.[2]?.response?.fileToken;
    values.postFile4 = values.postFileToken?.[3]?.fileToken;
    values.postFileToken4 = values.postFileToken?.[3]?.response?.fileToken;
    values.postFile5 = values.postFileToken?.[4]?.fileToken;
    values.postFileToken5 = values.postFileToken?.[4]?.response?.fileToken;
    values.postFile6 = values.postFileToken?.[5]?.fileToken;
    values.postFileToken6 = values.postFileToken?.[5]?.response?.fileToken;
    values.postFile7 = values.postFileToken?.[6]?.fileToken;
    values.postFileToken7 = values.postFileToken?.[6]?.response?.fileToken;
    values.postFile8 = values.postFileToken?.[7]?.fileToken;
    values.postFileToken8 = values.postFileToken?.[7]?.response?.fileToken;
    values.postFile9 = values.postFileToken?.[8]?.fileToken;
    values.postFileToken9 = values.postFileToken?.[8]?.response?.fileToken;
    values.postFile10 = values.postFileToken?.[9]?.fileToken;
    values.postFileToken10 = values.postFileToken?.[9]?.response?.fileToken;
    values.postFile = values.postFileToken?.[0]?.fileToken;
    values.postFileToken = values.postFileToken?.[0]?.response?.fileToken;
    // values.isSpecial = false;
    if (userType === UserTypeEnum.Normal) {
      values.isPublished = false;
      values.currentPostStatus = values.isConfirm ? PostStatusEnum.Pending : fetchNews?.data?.post?.currentPostStatus;
    } else if (userType === UserTypeEnum.Creator && !fetchNews?.data?.post?.isPublished && values.isConfirm) {
      values.isPublished = false;
      values.currentPostStatus = values.isConfirm ? PostStatusEnum.Pending : fetchNews?.data?.post?.currentPostStatus;
    } else if (userType === UserTypeEnum.Monitor && !fetchNews?.data?.post?.isPublished && values.isConfirm) {
      values.isPublished = false;
      values.currentPostStatus = values.isConfirm ? PostStatusEnum.Revised : fetchNews?.data?.post?.currentPostStatus;
    } else if (isPublisher) {
      values.isPublished = isPublisher ? values.isPublished : false;
      values.currentPostStatus = values.isPublished
        ? PostStatusEnum.Published
        : fetchNews?.data?.post?.currentPostStatus !== PostStatusEnum.Published
        ? fetchNews?.data?.post?.currentPostStatus
        : PostStatusEnum.Revised;
    }

    if (isPublisher && values.isRejected) {
      values.datePublished = undefined;
      values.publisherUserId = undefined;
      values.isPublished = false;
      values.currentPostStatus = PostStatusEnum.Rejected;
    } else if (isPublisher && values.isPublished && !fetchNews?.data?.post?.isPublished) {
      values.datePublished = new Date();
      values.publisherUserId = userId;
    }
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
            <Col xs={24} md={12} lg={8}>
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
                name="organization"
                label={t('organization')}
                rules={[{required: true, message: t('messages.required')}]}
                initialValue={
                  fetchNews?.data?.organizationId
                    ? fetchNews?.data?.organizationId
                    : +queryObject?.organization?.id > 0
                    ? +queryObject?.organization?.id
                    : undefined
                }>
                <SelectOrganization disabled={!!fetchNews?.data?.organizationId} />
              </Form.Item>
            </Col>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) => {
                if (prevValues.organization !== nextValues.organization) {
                  form.setFieldValue('groupMemberId', null);
                  form.setFieldValue('postGroupId', null);
                  return true;
                }
                return false;
              }}>
              {(fields) => {
                const organization = fields.getFieldValue('organization');
                return (
                  <>
                    {/* <Col xs={24} md={12} lg={8}>
                      <Form.Item
                        label={t('news_user')}
                        name="groupMemberId"
                        initialValue={
                          !!fetchNews?.data?.post?.groupMemberId
                            ? {
                                groupMember: {
                                  id: fetchNews?.data?.post?.groupMemberId,
                                  memberPosition: fetchNews?.data?.groupMemberMemberPosition
                                }
                              }
                            : undefined
                        }>
                        <MultiSelectPaginate
                          mode="single"
                          urlName={['organization', 'groupMembers', organization]}
                          url="services/app/GroupMembers/GetAll"
                          params={{organizationId: organization}}
                          renderCustomLabel={(option) => {
                            return `${option?.userName || ''} ${
                              option?.groupMember?.memberPosition ? `- ${option?.groupMember?.memberPosition}` : ''
                            }`;
                          }}
                          disabled={!organization}
                          keyPath={['groupMember']}
                          keyValue="id"
                          keyLabel="memberPosition"
                          placeholder={t('choose')}
                          showSearch={false}
                        />
                      </Form.Item>
                    </Col> */}
                    <Col xs={24} md={12} lg={8}>
                      <Form.Item
                        label={t('news_group')}
                        name="postGroupId"
                        initialValue={
                          !!fetchNews?.data?.post?.postGroupId
                            ? {
                                id: fetchNews?.data?.post?.postGroupId,
                                displayName: fetchNews?.data?.postGroupPostGroupDescription,
                                organizationName: fetchNews?.data?.organizationName || ''
                              }
                            : undefined
                        }>
                        <MultiSelectPaginate
                          mode="single"
                          urlName={['newsGroupSearch', organization]}
                          url="services/app/Posts/GetAllPostGroupForLookupTable"
                          params={{organizationId: organization}}
                          disabled={!organization}
                          searchKey="Filter"
                          showSearch
                          keyValue="id"
                          keyLabel="displayName"
                          renderCustomLabel={(option) =>
                            !!option?.displayName ? `${option?.displayName} - ${option?.organizationName}` : ''
                          }
                          placeholder={t('choose')}
                        />
                      </Form.Item>
                    </Col>
                  </>
                );
              }}
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) => {
                if (prevValues.postGroupId !== nextValues.postGroupId) {
                  form.setFieldValue('postSubGroupId', null);
                  return true;
                }
                return false;
              }}>
              {(fields) => {
                const postGroupId = fields.getFieldValue('postGroupId');
                return (
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      label={t('news_subgroup')}
                      name="postSubGroupId"
                      initialValue={
                        !!fetchNews?.data?.post?.postSubGroupId
                          ? {
                              postSubGroup: {
                                id: fetchNews?.data?.post?.postSubGroupId,
                                postSubGroupDescription: fetchNews?.data?.postGroupPostSubGroupDescription
                              }
                            }
                          : undefined
                      }>
                      <MultiSelectPaginate
                        mode="single"
                        urlName={['postSubGroups', postGroupId?.id]}
                        url="services/app/PostSubGroups/GetAll"
                        params={{postGroupId: postGroupId?.id}}
                        disabled={!postGroupId}
                        searchKey="Filter"
                        keyPath={['postSubGroup']}
                        keyValue="id"
                        keyLabel="postSubGroupDescription"
                        showSearch
                        placeholder={t('choose')}
                      />
                    </Form.Item>
                  </Col>
                );
              }}
            </Form.Item>
          </Row>
          <Row gutter={[16, 8]} className="w-full">
            <Col xs={24}>
              <Form.Item
                name="postFileToken"
                rules={[{required: true, message: t('messages.requiredFile')}]}
                initialValue={compact([
                  fetchNews?.data?.post?.postFile
                    ? {
                        fileName: fetchNews?.data?.postFileFileName,
                        fileToken: fetchNews?.data?.post?.postFile,
                        url: getImageUrl(fetchNews?.data?.post?.postFile)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile2
                    ? {
                        fileName: fetchNews?.data?.postFile2FileName,
                        fileToken: fetchNews?.data?.post?.postFile2,
                        url: getImageUrl(fetchNews?.data?.post?.postFile2)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile3
                    ? {
                        fileName: fetchNews?.data?.postFile3FileName,
                        fileToken: fetchNews?.data?.post?.postFile3,
                        url: getImageUrl(fetchNews?.data?.post?.postFile3)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile4
                    ? {
                        fileName: fetchNews?.data?.postFile4FileName,
                        fileToken: fetchNews?.data?.post?.postFile4,
                        url: getImageUrl(fetchNews?.data?.post?.postFile4)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile5
                    ? {
                        fileName: fetchNews?.data?.postFile5FileName,
                        fileToken: fetchNews?.data?.post?.postFile5,
                        url: getImageUrl(fetchNews?.data?.post?.postFile5)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile6
                    ? {
                        fileName: fetchNews?.data?.postFile6FileName,
                        fileToken: fetchNews?.data?.post?.postFile6,
                        url: getImageUrl(fetchNews?.data?.post?.postFile6)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile7
                    ? {
                        fileName: fetchNews?.data?.postFile7FileName,
                        fileToken: fetchNews?.data?.post?.postFile7,
                        url: getImageUrl(fetchNews?.data?.post?.postFile7)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile8
                    ? {
                        fileName: fetchNews?.data?.postFile8FileName,
                        fileToken: fetchNews?.data?.post?.postFile8,
                        url: getImageUrl(fetchNews?.data?.post?.postFile8)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile9
                    ? {
                        fileName: fetchNews?.data?.postFile9FileName,
                        fileToken: fetchNews?.data?.post?.postFile9,
                        url: getImageUrl(fetchNews?.data?.post?.postFile9)
                      }
                    : null,
                  fetchNews?.data?.post?.postFile10
                    ? {
                        fileName: fetchNews?.data?.postFile10FileName,
                        fileToken: fetchNews?.data?.post?.postFile10,
                        url: getImageUrl(fetchNews?.data?.post?.postFile10)
                      }
                    : null
                ])}>
                <CustomUpload
                  type="posts"
                  name={t('file')}
                  mode="multiple"
                  maxFile={10}
                  typeFile="image,video"
                  hasCrop
                  sortable
                  multiple
                  hasChangeCrop
                  aspect={1}
                  onUploading={setIsUploading}
                />
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
          <Row>
            <Col span={24}>
              <Form.Item name="postComment" label={t('comment')} initialValue={fetchNews?.data?.post?.postComment}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12} lg={8} className="flex align-center justify-center">
              <Form.Item
                name="isSpecial"
                valuePropName="checked"
                className="m-0"
                initialValue={fetchNews?.data?.post?.isSpecial}>
                <Checkbox disabled={!isPublisher}>{t('special.title')}</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} className="flex align-center justify-center">
              <Form.Item
                name="isPublished"
                valuePropName="checked"
                className="m-0"
                initialValue={id ? fetchNews?.data?.post?.isPublished : true}>
                <Checkbox disabled={!isPublisher}>{t('publish.title')}</Checkbox>
              </Form.Item>
            </Col>
            {isPublisher ? (
              <Col xs={24} md={12} lg={8} className="flex align-center justify-center">
                <Form.Item
                  name="isRejected"
                  valuePropName="checked"
                  className="m-0"
                  initialValue={id ? fetchNews?.data?.post?.currentPostStatus === PostStatusEnum.Rejected : false}>
                  <Checkbox>{t('reject.title')}</Checkbox>
                </Form.Item>
              </Col>
            ) : (
              <Col xs={24} md={12} lg={8} className="flex align-center justify-center">
                <Form.Item
                  name="isConfirm"
                  valuePropName="checked"
                  className="m-0"
                  initialValue={
                    id && fetchNews?.data?.post?.currentPostStatus !== PostStatusEnum.Rejected
                      ? (userType === UserTypeEnum.Normal &&
                          fetchNews?.data?.post?.currentPostStatus >= PostStatusEnum.Pending) ||
                        (userType === UserTypeEnum.Creator &&
                          fetchNews?.data?.post?.currentPostStatus >= PostStatusEnum.Pending) ||
                        (userType === UserTypeEnum.Monitor &&
                          fetchNews?.data?.post?.currentPostStatus >= PostStatusEnum.Revised) ||
                        fetchNews?.data?.post?.isPublished
                      : false
                  }>
                  <Checkbox
                    disabled={
                      (userType === UserTypeEnum.Normal &&
                        fetchNews?.data?.post?.currentPostStatus > PostStatusEnum.Pending) ||
                      (userType === UserTypeEnum.Creator &&
                        fetchNews?.data?.post?.currentPostStatus > PostStatusEnum.Pending) ||
                      (userType === UserTypeEnum.Monitor &&
                        fetchNews?.data?.post?.currentPostStatus > PostStatusEnum.Revised)
                    }>
                    {t('confirm.title')}
                  </Checkbox>
                </Form.Item>
              </Col>
            )}
          </Row>
          <FormActions isLoading={storeNews.isLoading} disabled={isUploading} onBack={onBack} />
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
