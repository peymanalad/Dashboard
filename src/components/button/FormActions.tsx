import React, {FC} from 'react';
import {Button, Row} from 'antd';
import {CloseCircleOutlined, SaveOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';

interface props {
  isLoading?: boolean;
  disabled?: boolean;
  onBack?(): void;
}

const FormActions: FC<props> = ({isLoading, disabled, onBack}) => {
  const {t} = useTranslation('general');
  return (
    <Row gutter={[16, 8]} className="w-full my-5" justify="space-between">
      {onBack && (
        <Button
          className="sm:w-unset bg-danger"
          type="primary"
          htmlType="button"
          onClick={onBack}
          icon={<CloseCircleOutlined />}>
          {t('cancel')}
        </Button>
      )}
      <Button
        className={`sm:w-unset ${!onBack ? 'mr-auto' : ''}`}
        type="primary"
        htmlType="submit"
        loading={isLoading}
        disabled={disabled}
        icon={<SaveOutlined />}>
        {t('save')}
      </Button>
    </Row>
  );
};
export default FormActions;
