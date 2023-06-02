import {ReloadOutlined} from '@ant-design/icons';
import {Button, Card, Col, Row, Typography} from 'antd';
import {useFetch, usePost} from 'hooks';
import {get} from 'lodash';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {convertUtcTimeToLocal} from 'utils';

const {Text} = Typography;

const ShowEmergency = () => {
  const {t} = useTranslation('user-show');
  const {id} = useParams<{id?: string}>();
  const history = useHistory();

  const fetchEmergency = useFetch({
    url: 'important_answers/{id}',
    name: ['emergency', id],
    params: {id},
    enabled: true
  });

  const postViewed = usePost({
    url: 'important_answers/{id}/reviewed',
    refetchQueries: ['important_answers', ['emergency', id]],
    onSuccess: () => history.push('/user/emergency/list')
  });

  return (
    <Card
      title={t('emergency_answer')}
      loading={fetchEmergency.isFetching}
      extra={
        get(fetchEmergency?.data, ['permissions', 'review']) && (
          <Button
            type="primary"
            loading={postViewed.isLoading}
            onClick={() => postViewed.post(undefined, undefined, {id: id || fetchEmergency?.data?.id})}
            className="sm:d-block ant-btn-warning d-text-none md:d-text-unset"
            icon={<ReloadOutlined />}>
            {t('reviewed')}
          </Button>
        )
      }
      className="w-full shadow-lg">
      <Row className="w-full" gutter={24}>
        <Col xs={24} md={12} lg={8} className="mb-1">
          <Text> {t('patient_name', {name: get(fetchEmergency.data, ['user', 'full_name']) || '-'})}</Text>
        </Col>
        <Col xs={24} md={12} lg={8} className="mb-1">
          <Text> {t('doctorName', {name: get(fetchEmergency.data, ['doctor', 'full_name']) || '-'})}</Text>
        </Col>
        <Col xs={24} md={12} lg={8} className="mb-1">
          <Text> {t('reviewer_name', {name: get(fetchEmergency.data, ['reviewer', 'full_name']) || '-'})}</Text>
        </Col>
      </Row>
      <Row className="w-full" gutter={16}>
        <Col xs={24} md={12} lg={8} className="mb-1">
          <Text>
            {t('createdAt', {
              date: convertUtcTimeToLocal(get(fetchEmergency.data, 'created_at'), 'jYYYY/jMM/jDD : HH:mm') || '-'
            })}
          </Text>
        </Col>
        <Col xs={24} md={12} lg={8} className="mb-1">
          <Text>
            {t('answer_at', {
              date: convertUtcTimeToLocal(get(fetchEmergency.data, 'answer_at'), 'jYYYY/jMM/jDD : HH:mm') || '-'
            })}
          </Text>
        </Col>
        <Col xs={24} md={12} lg={8} className="mb-1">
          <Text>
            {t('reviewed_at', {
              date: convertUtcTimeToLocal(get(fetchEmergency.data, 'reviewed_at'), 'jYYYY/jMM/jDD : HH:mm') || '-'
            })}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col span={24} className="mb-2">
          <Text className="text-md">{t('question', {question: get(fetchEmergency.data, ['question', 'title'])})}</Text>
        </Col>
        <Col span={24}>
          <Text>{t('answer', {answer: get(fetchEmergency.data, 'answer')})}</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default ShowEmergency;
