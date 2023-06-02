import React, {FC} from 'react';
import {Result, Button} from 'antd';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {getLangSearchParam} from 'utils';

const NotFoundPage: FC = () => {
  const history = useHistory();
  const {t} = useTranslation('not_found_page');
  const backToHome = () => {
    history.push(getLangSearchParam('/dashboard'));
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('content')}
      extra={
        <Button type="primary" onClick={backToHome}>
          {t('back_to_dashboard')}
        </Button>
      }
    />
  );
};

export default NotFoundPage;
