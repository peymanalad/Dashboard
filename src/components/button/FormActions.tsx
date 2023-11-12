import React, {FC} from 'react';
import {Button, Row} from 'antd';
import {CloseCircleOutlined, SaveOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';

interface props {
  isLoading?: boolean;
  onBack(): void;
}

const FormActions: FC<props> = ({isLoading, onBack}) => {
  const {t} = useTranslation('general');
  return (
    <Row gutter={[16, 8]} className="w-full my-5" justify="space-between">
      <Button
        className="sm:w-unset bg-danger"
        type="primary"
        htmlType="button"
        onClick={onBack}
        icon={<CloseCircleOutlined />}>
        {t('cancel')}
      </Button>
      <Button className="sm:w-unset" type="primary" htmlType="submit" loading={isLoading} icon={<SaveOutlined />}>
        {t('save')}
      </Button>
    </Row>
  );
};
export default FormActions;
