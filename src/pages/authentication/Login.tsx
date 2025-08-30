import React, {useContext, type FC} from 'react';
import {Typography, Row, Image, Form, Col, Input, Button, Card} from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import {JSEncrypt} from 'jsencrypt';
import usePost from 'hooks/resource/usePost';
import useRecaptcha from 'hooks/user/useRecaptcha';
import {UsersContext} from 'context';
import {useHistory, useLocation} from 'react-router-dom';
import {queryStringToObject} from 'utils';
import {useTranslation} from 'react-i18next';
import {DeedLogoImg} from 'assets';
import {publicKey} from 'assets/constants/keys';
import {windowProcess} from 'utils/process';
import type {userAccessProps} from 'types/user';
import type {AuthFormProps, AuthResponseProps} from 'types/auth';

const ReCAPTCHAAny = ReCAPTCHA as any;

const {Text} = Typography;

const LoginPage: FC = () => {
  const {t} = useTranslation('login');
  const location = useLocation();
  const query = queryStringToObject(location.search);
  const history = useHistory();
  const {setUser} = useContext(UsersContext);
  const {capchaToken, recaptchaRef, handleRecaptcha} = useRecaptcha();

  const userToDashboard = (user: userAccessProps) => {
    setUser({...user});
    query?.redirect ? history.push(query?.redirect) : history.push('/');
    window.location.reload();
  };

  const loginRequest = usePost({
    url: 'TokenAuth/Authenticate',
    onSuccess: (data: AuthResponseProps) => {
      userToDashboard({
        is_logged_in: !!data?.accessToken,
        access_token: data?.accessToken,
        encrypted_access_token: data?.encryptedAccessToken,
        refresh_token: data.refreshToken,
        expires_in: data.expireInSeconds,
        id: data.userId
      });
    }
  });

  const onSubmit = (values: AuthFormProps) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedPassword = encrypt.encrypt(values.pass);

    loginRequest.post({
      userNameOrEmailAddress: values.name,
      password: encryptedPassword.toString(),
      rememberClient: true,
      singleSignIn: false,
      returnUrl: null,
      captchaResponse: null,
      capchaToken
    });
  };

  const onExpired = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
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
                name="name"
                rules={[{required: true, message: t('messages.required_username')}]}>
                <Input className="ltr-input" autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('password')}
                name="pass"
                rules={[{required: true, message: t('messages.required_password')}]}>
                <Input.Password className="ltr-input" type="password" autoComplete="new-password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} justify="center" className="py-4">
            <ReCAPTCHAAny
              ref={recaptchaRef}
              hl="fa"
              size="normal"
              sitekey={windowProcess('REACT_APP_RECAPTCHA_SITE_KEY') || ''}
              onChange={handleRecaptcha}
              onExpired={onExpired}
            />
            <Button type="primary" htmlType="submit" disabled={!capchaToken} loading={loginRequest.isLoading}>
              {t('continue')}
            </Button>
          </Row>
        </Form>
      </Card>
    </Row>
  );
};

export default LoginPage;
