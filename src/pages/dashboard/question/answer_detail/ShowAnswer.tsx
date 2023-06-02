import {LikeOutlined} from '@ant-design/icons';
import {Button, Card, Col, Row, Typography} from 'antd';
import {useFetch, usePost} from 'hooks';
import {get} from 'lodash';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {convertUtcTimeToLocal} from 'utils';

const {Text, Title} = Typography;

const ShowAnswer = () => {
  const {id} = useParams<any>();
  const {t} = useTranslation('question');
  const fetchAnswerDetail = useFetch({
    url: 'answer_details/{id}',
    name: ['answer', id],
    params: {id},
    enabled: true
  });

  const review = usePost({
    url: 'answer_details/{id}/reviewed',
    refetchQueries: [['answer', id]]
  });

  const reviewHandler = () => {
    review.post({}, {}, {id});
  };

  return (
    <Card
      title={t('answer')}
      bordered={false}
      loading={fetchAnswerDetail?.isFetching}
      extra={
        get(fetchAnswerDetail?.data, ['permissions', 'review']) && (
          <Button
            className="d-text-none md:d-text-unset text-green"
            icon={<LikeOutlined />}
            onClick={reviewHandler}
            loading={review.isLoading}>
            {t('reviewed')}
          </Button>
        )
      }>
      <Row>
        <Col xs={24} md={12} lg={6} className="flex flex-col mb-1">
          <Title level={5}>{t('user')}</Title>
          <Text>{get(fetchAnswerDetail?.data, ['user', 'full_name']) || '-'}</Text>
        </Col>
        <Col xs={24} md={12} lg={6} className="flex flex-col mb-1">
          <Title level={5}>{t('doctor')}</Title>
          <Text>{get(fetchAnswerDetail?.data, ['doctor', 'full_name']) || '-'}</Text>
        </Col>
        <Col xs={24} md={12} lg={6} className="flex flex-col mb-1">
          <Title level={5}>{t('reviewer')}</Title>
          <Text>{get(fetchAnswerDetail?.data, ['reviewer', 'full_name']) || '-'}</Text>
        </Col>
        <Col xs={24} md={12} lg={6} className="flex flex-col mb-1">
          <Title level={5}>{t('reviewe_at')}</Title>
          <Text>
            {get(fetchAnswerDetail?.data, 'reviewed_at')
              ? convertUtcTimeToLocal(get(fetchAnswerDetail?.data, 'reviewed_at'))
              : '-'}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col xs={24} className="flex flex-col mb-1">
          <Title level={5}>{t('question')}</Title>
          <Text>{get(fetchAnswerDetail?.data, ['question', 'title']) || '-'}</Text>
        </Col>
      </Row>
      <Row>
        <Col xs={24} className="flex flex-col mb-1">
          <Title level={5}>{t('answer')}</Title>
          <Text>{get(fetchAnswerDetail?.data, 'answer') || '-'}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={6} className="flex flex-col mb-1">
          <Title level={5}>{t('answer_at')}</Title>
          <Text>
            {get(fetchAnswerDetail?.data, 'answer_at')
              ? convertUtcTimeToLocal(get(fetchAnswerDetail?.data, 'answer_at'))
              : '-'}
          </Text>
        </Col>
        <Col span={6} className="flex flex-col mb-1">
          <Title level={5}>{t('created_at')}</Title>
          <Text>
            {get(fetchAnswerDetail?.data, 'created_at')
              ? convertUtcTimeToLocal(get(fetchAnswerDetail?.data, 'created_at'))
              : '-'}
          </Text>
        </Col>
      </Row>
    </Card>
  );
};

export default ShowAnswer;
