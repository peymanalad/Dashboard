import React, {type FC} from 'react';
import {Typography, Row, Image, Col, Button, Card} from 'antd';
import {Link, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {DeedLogoImg} from 'assets';
import {AndroidOutlined, LoginOutlined} from '@ant-design/icons';

const {Text} = Typography;

const LandingPage: FC = () => {
  const {t} = useTranslation('login');

  return (
    <Row className="login-bg flex flex-col justify-center items-center">
      <Text className="text-center text-grayLight">{t('messages.welcome_to_deed')}</Text>
      <Card className="mt-2 max-w-12" title={t('deed')} extra={<Image preview={false} src={DeedLogoImg} width={30} />}>
        <Row gutter={[16, 8]} className="w-full m-0">
          <Col span={24}>
            <Link to="/prescription/amounts/create" className="w-full d-block">
              <Button
                type="link"
                className="w-full flex-center"
                style={{color: '#8FBC46'}}
                size="large"
                icon={<AndroidOutlined style={{fontSize: 25}} />}>
                {t('download_app')}
              </Button>
            </Link>
          </Col>
          <Col span={24} className="mt-6 w-full d-block">
            <Link to="/login">
              <Button
                type="primary"
                className="w-full flex-center"
                ghost
                size="large"
                icon={<LoginOutlined style={{fontSize: 25}} />}>
                {t('to_login_admin')}
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </Row>
  );
};

export default LandingPage;
