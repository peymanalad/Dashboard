import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {Card, Button, Form, Row} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {CustomUpload} from 'components';
import map from 'lodash/map';

interface Props {
  id?: string;
}

const PicturesInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');

  const fetchPictures = useFetch({
    url: 'visits/{id}/pictures',
    name: ['visit', 'picture', id],
    params: {id},
    enabled: true
  });

  const uploadImages = usePost({
    url: 'visits/{id}/pictures',
    method: 'POST',
    removeQueries: [['visit', 'picture', id]]
  });

  const onFinish = (values: any) => {
    values.pictures = map(values?.pictures, 'path');
    uploadImages.post(values, {}, {id});
  };

  return (
    <Card
      title={t(id ? 'edit_file.title' : 'create.title')}
      loading={fetchPictures?.isFetching || !fetchPictures?.data}
      bordered={false}
      className="w-full">
      <Form layout="vertical" requiredMark={false} className=" w-full" name="ProfessionalInfo" onFinish={onFinish}>
        <Form.Item name="pictures" noStyle initialValue={fetchPictures?.data}>
          <CustomUpload type="visits" mode="multiple" typeFile="image" name="image" />
        </Form.Item>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={uploadImages.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};
export default PicturesInfo;
