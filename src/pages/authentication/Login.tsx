import React, {useContext, FC} from 'react';
import {Typography, Row, Image, Form, Col, Input, Button, Card} from 'antd';
import {userAccessProps} from 'types/user';
import {usePost} from 'hooks';
import {UsersContext} from 'contexts';
import {useHistory, useLocation} from 'react-router-dom';
import {getLangSearchParam, queryStringToObject} from 'utils';
import {useTranslation} from 'react-i18next';
import {BehzeeLogoImg} from 'assets';

const {Text} = Typography;

const LoginPage: FC = () => {
  const {t} = useTranslation('login');
  const location = useLocation();
  const query = queryStringToObject(location.search);
  const history = useHistory();
  const {setUsers} = useContext(UsersContext);

  const userToDashboard = (user: userAccessProps) => {
    setUsers([{...user, is_logged_in: true}]);
    query?.redirect ? history.push(getLangSearchParam(query?.redirect)) : history.push(getLangSearchParam('/'));
  };

  const loginRequest = usePost({
    url: 'auth/validation',
    isGeneral: true,
    onSuccess: (data) => userToDashboard(data)
  });

  const onSubmit = (values: {username: string; password: string}) => {
    // const formValue = {
    //   username,
    //   password: values.password,
    //   registered: showPassword,
    //   language: isEnLocale() ? 'en' : 'fa',
    //   app: 'admin'
    // };
    // verify.post(formValue);
  };

  return (
    <Row className="login-bg flex flex-col justify-center items-center">
      <Text className="text-center text-grayLight">{t('messages.welcome')}</Text>
      <Card
        className="mt-2 max-w-12"
        title={t('login_page')}
        extra={<Image preview={false} src={BehzeeLogoImg} width={30} />}>
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
