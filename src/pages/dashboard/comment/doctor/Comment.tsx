import React, {memo} from 'react';
import {MessageContainer} from 'components';
import {useInfinite} from 'hooks';
import {Link, useParams} from 'react-router-dom';
import get from 'lodash/get';
import {Button} from 'antd';
import {BulbOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';

const DoctorComment = () => {
  const {t} = useTranslation('comments');
  const {reply_id, recommendation_id} = useParams<{reply_id: string; recommendation_id: string}>();

  const getComment = useInfinite({
    url: 'comments/{id}',
    name: ['comments', 'doctor', reply_id],
    params: {id: reply_id},
    enabled: true
  });

  return (
    <MessageContainer
      getMessageData={getComment}
      urlName={['comments', 'doctors', reply_id]}
      deleteUrl="/comments/{id}/"
      updateUrl="/comments/{id}/"
      postUrl="/comments"
      rejectUrl="/comments/{id}/reject"
      confirmUrl="/comments/{id}/confirm"
      commentType="support_to_doctor"
      cardTitle={get(getComment?.data, [0, 'recommendation_id', 'title']) || ''}
      hasReply={false}
      cardExtra={
        <Link to={`/education/recommendation/edit/${recommendation_id}`}>
          <Button type="primary" className="ant-btn-success d-text-none md:d-text-unset" icon={<BulbOutlined />}>
            {t('showRecommendation')}
          </Button>
        </Link>
      }
    />
  );
};

export default memo(DoctorComment);
