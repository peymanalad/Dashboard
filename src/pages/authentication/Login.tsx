import React, {useContext, type FC} from 'react';
import {Typography, Row, Image, Form, Col, Input, Button, Card} from 'antd';
import {usePost} from 'hooks';
import {UsersContext} from 'contexts';
import {useHistory, useLocation} from 'react-router-dom';
import {queryStringToObject} from 'utils';
import {useTranslation} from 'react-i18next';
import {DeedLogoImg} from 'assets';
import type {userAccessProps} from 'types/user';
import type {AuthFormProps, AuthResponseProps} from 'types/auth';

const {Text} = Typography;

const LoginPage: FC = () => {
  const {t} = useTranslation('login');
  const location = useLocation();
  const query = queryStringToObject(location.search);
  const history = useHistory();
  const {setUsers} = useContext(UsersContext);

  const userToDashboard = (user: userAccessProps) => {
    setUsers([{...user}]);
    query?.redirect ? history.push(query?.redirect) : history.push('/');
  };

  const loginRequest = usePost({
    url: 'TokenAuth/Authenticate',
    onSuccess: (data: AuthResponseProps) => {
      if (data?.accessToken) {
        userToDashboard({
          is_logged_in: true,
          access_token: data?.accessToken,
          refresh_token: data.refreshToken,
          expires_in: data.expireInSeconds,
          id: data.userId
        });
      }
    }
  });

  const onSubmit = (values: AuthFormProps) => {
    loginRequest.post({
      userNameOrEmailAddress: values.username,
      password: values.password,
      rememberClient: true,
      singleSignIn: false,
      returnUrl: null,
      captchaResponse: null
    });
  };

  return (
    <Row className="login-bg flex flex-col justify-center items-center">
      <Text className="text-center text-grayLight">{t('messages.welcome')}</Text>
      <Card
        className="mt-2 max-w-12"
        title={t('login_page')}
        extra={<Image preview={false} src={DeedLogoImg} width={30} />}>
        <Form layout="vertical" requiredMark={false} name="login_username" className="my-5" onFinish={onSubmit}>
          <Row gutter={[16, 8]} className="w-full m-0">
            <Col span={24}>
              <Form.Item
                label={t('username')}
                name="username"
                rules={[{required: true, message: t('messages.required_username')}]}>
                <Input className="ltr-input" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('password')}
                name="password"
                rules={[{required: true, message: t('messages.required_password')}]}>
                <Input.Password className="ltr-input" type="password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="center" className="py-4">
            <Button type="primary" htmlType="submit" loading={loginRequest.isLoading}>
              {t('continue')}
            </Button>
          </Row>
        </Form>
        <Text className="mt-2 text-sm px-3" type="secondary" strong>
          {t('messages.support')}
        </Text>
      </Card>
    </Row>
  );
};

export default LoginPage;
