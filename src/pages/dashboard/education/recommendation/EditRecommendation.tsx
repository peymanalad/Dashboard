import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Checkbox, Col, Divider, Form, Row, Button} from 'antd';
import {Link, useHistory, useParams} from 'react-router-dom';
import {RecommendationBaseInfo, RecommendationSource} from 'containers';
import {useFetch, usePost} from 'hooks';
import {MessageOutlined} from '@ant-design/icons';
import {getLangSearchParam, saveStorageForm, getStorageForm} from 'utils';
import {CustomUpload, SimpleSelect} from 'components';
import {recommendationStatus} from 'assets';
import map from 'lodash/map';
import concat from 'lodash/concat';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import {useQueryClient} from 'react-query';

const EditRecommendation: FC = () => {
  const {t} = useTranslation('recommendation');
  const {id} = useParams<{id: string}>();
  const query = useQueryClient();
  const history = useHistory();
  const [form] = Form.useForm();

  const fetchRecommendation = useFetch({
    url: 'recommendations/{id}',
    params: {id},
    name: ['recommendation', id],
    enabled: false
  });

  const updateRecommendation = usePost({
    url: 'recommendations/{id}',
    method: 'PATCH',
    removeQueries: ['recommendations', ['recommendation', id]],
    form,
    onSuccess: () => {
      localStorage.removeItem(`recommendation_${id}`);
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/recommendation/list'));
    }
  });

  const createRecommendation = usePost({
    url: 'recommendations',
    method: 'POST',
    removeQueries: ['recommendations'],
    form,
    isGeneral: false,
    onSuccess: () => {
      localStorage.removeItem(`recommendation_${id}`);
      if (history.length > 1 && document.URL !== document.referrer) history.goBack();
      else history.replace(getLangSearchParam('/education/recommendation/list'));
    }
  });

  useEffect(() => {
    getStorageForm(`recommendation_${id}`)
      .then((formData) => {
        query.setQueryData(['recommendation', id], formData);
        form.setFieldsValue(formData);
      })
      .catch(() => {
        if (id) fetchRecommendation.refetch();
      });
  }, []);

  const onFinish = (values: any) => {
    values.disease_id = values.disease_id?.id;
    values.subject_id = values.subject_id?.id;
    values.creator_id = values.creator_id?.id;
    values.language = values.language?.name;
    values.category_id = values.category_id?.id;
    values.researcher_id = values.researcher_id?.id;
    values.is_public = values.is_public ? 1 : 0;
    values.exclude_disease = map(values.exclude_disease, 'id');
    values.and_disease = map(values.and_disease, 'id');
    values.tags = map(values.tags, 'id');
    values.other_languages = map(values.other_languages, 'id');
    values.sources = map(values.sources, 'id');
    values.file = concat(
      map(values.images, (item: any) => ({type: 'image', path: item?.path})),
      concat(
        map(values.sounds, (item: any) => ({type: 'audio', path: item?.path})),
        map(values.videos, (item: any) => ({type: 'video', path: item?.path}))
      )
    );

    id ? updateRecommendation.post(values, {}, {id}) : createRecommendation.post(values);
  };
  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="recommendation"
        requiredMark={false}
        onFinish={onFinish}
        onValuesChange={(changedFields, allFields) => saveStorageForm(`recommendation_${id}`, allFields)}
        scrollToFirstError>
        <RecommendationBaseInfo form={form} id={id} fetchRecommendation={fetchRecommendation} />
        <Card
          title={t('files')}
          loading={
            !isEmpty(id) && (fetchRecommendation.isLoading || fetchRecommendation.isIdle) && !fetchRecommendation.data
          }
          bordered={false}
          className="w-full my-4">
          <Row className="flex-center w-full flex-col">
            <Divider orientation="right">{t('images')}</Divider>
            <Form.Item
              name="images"
              noStyle
              initialValue={
                fetchRecommendation?.data?.images || filter(fetchRecommendation?.data?.files, {type: 'image'})
              }>
              <CustomUpload type="recommendations" mode="multiple" typeFile="image" name="image" hasCrop />
            </Form.Item>
            <Divider orientation="right">{t('audios')}</Divider>
            <Form.Item
              name="sounds"
              noStyle
              initialValue={
                fetchRecommendation?.data?.audio || filter(fetchRecommendation?.data?.files, {type: 'audio'})
              }>
              <CustomUpload type="recommendations" mode="multiple" typeFile="sound" name="sound" />
            </Form.Item>
            <Divider orientation="right">{t('videos')}</Divider>
            <Form.Item
              name="videos"
              noStyle
              initialValue={
                fetchRecommendation?.data?.video || filter(fetchRecommendation?.data?.files, {type: 'video'})
              }>
              <CustomUpload type="recommendations" mode="multiple" typeFile="video" name="video" />
            </Form.Item>
          </Row>
        </Card>
        <Card
          title={t('title_rcmd')}
          loading={
            !isEmpty(id) && (fetchRecommendation.isLoading || fetchRecommendation.isIdle) && !fetchRecommendation.data
          }
          bordered={false}
          className="w-full my-4">
          <Row gutter={[16, 8]} className="w-full justify-between">
            <Col xs={24} md={12} lg={8}>
              <Form.Item label={t('status')} name="status" initialValue={fetchRecommendation?.data?.status || 'new'}>
                <SimpleSelect
                  keys="name"
                  label="name_fa"
                  placeholder={t('empty')}
                  data={recommendationStatus?.map((value) => ({...value, name_fa: t(value?.name)}))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8} className="flex-center">
              <Form.Item
                name="is_public"
                valuePropName="checked"
                className="m-0"
                initialValue={fetchRecommendation?.data?.is_public}>
                <Checkbox>{t('show_all_therapists')}</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <RecommendationSource
          fetchRecommendation={fetchRecommendation}
          form={form}
          id={id}
          sending={updateRecommendation.isLoading || createRecommendation.isLoading}
        />
      </Form>
      {!isEmpty(id) && (
        <Link to={`/education/recommendation/edit/comment/${id}`}>
          <Button
            type="primary"
            className="w-14 h-14 flex-center fixed b-2 shadow-md"
            shape="circle"
            icon={<MessageOutlined style={{fontSize: 21}} />}
          />
        </Link>
      )}
    </>
  );
};

export default EditRecommendation;
