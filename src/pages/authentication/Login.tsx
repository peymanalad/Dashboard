import React, {useContext, useState, FC} from 'react';
import {LoginUserName, LoginPassword} from 'containers';
import {Typography, Row} from 'antd';
import {userAccessProps} from 'types/user';
import {usePost} from 'hooks';
import {UsersContext} from 'contexts';
import {useHistory, useLocation} from 'react-router-dom';
import {getLangSearchParam, isEnLocale, queryStringToObject} from 'utils';
import {useTranslation} from 'react-i18next';
import {CSSTransition} from 'react-transition-group';

const {Text} = Typography;

const Login: FC = () => {
  const {t} = useTranslation('login');
  const location = useLocation();
  const query = queryStringToObject(location.search);
  const history = useHistory();
  const {setUsers} = useContext(UsersContext);

  const [showUsername, setShowUsername] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>('');

  const check = usePost({
    url: 'auth/check',
    isGeneral: true,
    onSuccess: (data) => data?.registered && setShowUsername(false)
  });

  const userToDashboard = (user: userAccessProps) => {
    setUsers([{...user, is_logged_in: true}]);
    query?.redirect ? history.push(getLangSearchParam(query?.redirect)) : history.push(getLangSearchParam('/'));
  };

  const verify = usePost({
    url: 'auth/validation',
    isGeneral: true,
    onSuccess: (data) => userToDashboard(data)
  });

  const onCheck = (values: {username: string}) => {
    setUsername(values.username);
    const formValue = {
      username: values.username,
      language: isEnLocale() ? 'en' : 'fa',
      app: 'admin',
      send_code: false
    };
    check.post(formValue);
  };

  const onSubmit = (values: {password: string}) => {
    const formValue = {
      username,
      password: values.password,
      registered: showPassword,
      language: isEnLocale() ? 'en' : 'fa',
      app: 'admin'
    };
    verify.post(formValue);
  };

  return (
    <Row className="login-bg flex flex-col justify-center items-center">
      <Text className="text-center text-black-md">{t('messages.welcome')}</Text>
      <CSSTransition
        in={showUsername}
        timeout={600}
        classNames="login"
        unmountOnExit
        onEnter={() => setShowPassword(false)}
        onExited={() => setShowPassword(true)}>
        <LoginUserName onSubmit={(values) => onCheck(values)} isLoading={check.isLoading} />
      </CSSTransition>
      <CSSTransition
        in={showPassword}
        timeout={600}
        classNames="login"
        unmountOnExit
        onEnter={() => setShowUsername(false)}
        onExited={() => setShowUsername(true)}>
        <LoginPassword
          onSubmit={(values) => onSubmit(values)}
          onBackClick={() => {
            setShowPassword(false);
          }}
          isLoading={verify.isLoading}
        />
      </CSSTransition>
    </Row>
  );
};

export default Login;
