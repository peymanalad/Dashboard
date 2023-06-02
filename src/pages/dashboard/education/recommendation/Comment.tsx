import React, {memo} from 'react';
import {Button, Tooltip} from 'antd';
import {useTranslation} from 'react-i18next';
import {useInfinite} from 'hooks';
import {useHistory, useParams} from 'react-router-dom';
import {LeftOutlined} from '@ant-design/icons';
import {MessageContainer} from 'components';

const RecommendationComment = () => {
  const {t} = useTranslation('recommendation');
  const {recommendation_id} = useParams<{recommendation_id: string}>();

  const history = useHistory();

  const getComment = useInfinite({
    url: '/recommendations/{id}/comments/paginate',
    name: ['recommendation', 'comments', recommendation_id],
    params: {id: recommendation_id},
    isGeneral: false,
    enabled: true
  });

  return (
    <MessageContainer
      getMessageData={getComment}
      urlName={`recommendationComments_${recommendation_id}`}
      deleteUrl="/comments/{id}"
      updateUrl="/comments/{id}/"
      postUrl="/comments"
      commentType="research_to_research"
      uploadType="recommendations"
      useAdvancedComposer
      disableReadyMessage
      cardTitle={t('researchers_conversation')}
      cardExtra={
        <Tooltip title={t('back_to_recommendation')}>
          <Button type="text" icon={<LeftOutlined />} onClick={() => history.goBack()} />
        </Tooltip>
      }
    />
  );
};

export default memo(RecommendationComment);
