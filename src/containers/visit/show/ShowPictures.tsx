import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {Card, Typography} from 'antd';
import {ShowImages} from 'components';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

interface Props {
  id?: string;
}

const {Text} = Typography;

const PicturesInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');

  const fetchPictures = useFetch({
    url: 'visits/{id}/pictures',
    name: ['visit', 'picture', id],
    params: {id},
    enabled: true
  });

  return (
    <Card
      title={t(id ? 'edit_file.title' : 'create.title')}
      loading={fetchPictures?.isFetching}
      bordered={false}
      className="w-full">
      <div className="flex-center w-full flex-col">
        {!isEmpty(fetchPictures?.data) ? (
          <ShowImages
            data={map(fetchPictures?.data, (image) => ({path: image?.url, imagePath: image?.path}))}
            listType="picture-card"
            defaultImageName={t('show.prescription')}
            disabled
            className="img-show-info"
          />
        ) : (
          <Text className="value-show-info">{t('empty')}</Text>
        )}
      </div>
    </Card>
  );
};

export default PicturesInfo;
