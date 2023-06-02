import React, {FC, useEffect, useState} from 'react';
import {Card, Col, Form, Row, Space, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {DrillDownSelectPaginate, ShowItems} from 'components';

interface Props {
  id?: string;
}
const {Text} = Typography;

const ShowProfessionInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('user-show');
  const [diseaseId, setDiseaseId] = useState<any>(null);

  const fetchRecommendationStatus = useFetch({
    url: 'users/{id}/recommendation_feedback_count',
    params: {id}
  });

  const fetchProfession = useFetch({
    url: 'users/{id}/profession',
    name: ['user', id, 'profession'],
    params: {id},
    enabled: true
  });

  useEffect(() => {
    fetchRecommendationStatus.fetch({}, {disease_id: diseaseId});
  }, [diseaseId]);

  return (
    <Card title={t('title_show')} bordered={false} loading={fetchProfession.isFetching}>
      <Form layout="vertical" className=" w-full">
        <Row gutter={[16, 8]}>
          <Col xs={24} md={12}>
            <Form.Item label={t('profession_info.disease_status')} name="test">
              <DrillDownSelectPaginate
                title={t('related_disease')}
                placeholder={t('empty')}
                onChange={(disease: any) => setDiseaseId(disease.id)}
                mode="single"
                notSelectParent
                notSelectChild={false}
                url="diseases/children"
                urlName="diseases"
                isGeneral
                keyLabel="name"
                keyValue="id"
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} className="flex items-center">
            <Space className="flex-row md:flex-col">
              <Text>
                {t('profession_info.confirmed', {count: fetchRecommendationStatus?.data?.confirmed_count || '-'})}
              </Text>
              <Text>
                {t('profession_info.not_confirmed', {
                  count: fetchRecommendationStatus?.data?.not_confirmed_count || '-'
                })}
              </Text>
              <Text>
                {t('profession_info.not_checked', {count: fetchRecommendationStatus?.data?.not_checked_count || '-'})}
              </Text>
            </Space>
          </Col>
        </Row>
      </Form>

      <ShowItems
        firstKeysShow={['medical_council_code', 'nickname', 'categories']}
        data={fetchProfession?.data}
        t={t}
      />
    </Card>
  );
};

export default ShowProfessionInfo;
