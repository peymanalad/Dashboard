import React, {FC} from 'react';
import {Card} from 'antd';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useFetch} from 'hooks';
import {ShowItems} from 'components';
import {tableProps} from 'types/common';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import {recommendationValue, SubjectRecommendationProps} from 'types/care';

const ViewCare: FC = () => {
  const {t} = useTranslation('care');
  const {id} = useParams<{id?: string}>();

  const fetchViewCare = useFetch({
    url: `diseases/view/${id}`,
    name: 'viewCare',
    enabled: true,
    isGeneral: false
  });

  const tables: tableProps[] = [
    {
      name: 'category_recommendation',
      data: fetchViewCare?.data?.category_recommendation,
      columns: [
        {
          title: t('category_recommendation'),
          dataIndex: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: t('count'),
          dataIndex: 'count',
          key: 'count',
          align: 'center'
        }
      ]
    },
    {
      name: 'subject_recommendation',
      data: map(fetchViewCare?.data?.subject_recommendation, (item: SubjectRecommendationProps) => {
        const outPut: any = {name: item?.name};
        forEach(item?.values, (value: recommendationValue) => {
          outPut[value?.name] = value?.count;
        });
        return outPut;
      }),
      columns: [
        {
          title: t('subject_recommendation'),
          dataIndex: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: t('iranian'),
          dataIndex: t('iranian'),
          key: 'iranian',
          align: 'center'
        },
        {
          title: t('classic'),
          dataIndex: t('classic'),
          key: 'classic',
          align: 'center'
        },
        {
          title: t('chinese'),
          dataIndex: t('chinese'),
          key: 'chinese',
          align: 'center'
        },
        {
          title: t('indian'),
          dataIndex: t('indian'),
          key: 'indian',
          align: 'center'
        }
      ]
    }
  ];

  return (
    <Card title={t('title_show')} bordered={false} loading={fetchViewCare.isFetching}>
      <ShowItems
        data={fetchViewCare?.data}
        firstKeysShow={['name', 'type', 'icd', 'picture', 'picture_url']}
        tables={tables}
        t={t}
      />
    </Card>
  );
};

export default ViewCare;
