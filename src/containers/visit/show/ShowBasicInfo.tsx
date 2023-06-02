import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {Card} from 'antd';
import {ShowItems} from 'components';

interface Props {
  id?: string;
}

const ShowBasicInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');

  const fetchVisit = useFetch({
    name: ['visit', 'basic', id],
    url: 'visits/{id}',
    params: {id},
    enabled: true
  });

  return (
    <Card title={t('show.title')} loading={fetchVisit.isFetching} bordered={false} className="w-full">
      <ShowItems data={fetchVisit?.data} t={t} />
    </Card>
  );
};

export default ShowBasicInfo;
