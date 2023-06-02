import {Modal, Form, Row, Col, Input, Button} from 'antd';
import {usePost, useUser} from 'hooks';
import {ArrowRightOutlined} from '@ant-design/icons';
import React, {forwardRef, ForwardRefRenderFunction, RefObject, useImperativeHandle, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQueryClient} from 'react-query';
import {CSSTransition} from 'react-transition-group';
import {filter, includes, map} from 'lodash';
import {userAccessProps} from 'types/user';
import {useHistory} from 'react-router-dom';
import {isEnLocale} from 'utils';

interface Props {
  ref?: RefObject<refProps>;
}

interface refProps {
  open: () => void;
  close: () => void;
}

const AddUserModal: ForwardRefRenderFunction<refProps, Props> = ({ref}, forwardedRef) => {
  const {t} = useTranslation('login');
  const {t: tD} = useTranslation('dashboard');
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);
  const [showUsername, setShowUsername] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>('');
  const queryClient = useQueryClient();

  const user = useUser();
  const check = usePost({
    url: 'auth/check',
    isGeneral: true,
    onSuccess: (data) => data?.registered && setShowUsername(false)
  });

  const postMenu = usePost({
    url: 'menu',
    method: 'GET',
    onSuccess: (response, request, params) => {
      const ids = map(user.users, 'id');
      if (!includes(ids, response?.id)) user.setUsers((prevState) => [{...params, is_logged_in: true}, ...prevState]);
      else {
        const temp = filter(user.users, (item: any) => item.id !== response?.id);
        user.setUsers(() => [{...params, is_logged_in: true}, ...temp]);
      }
      history.replace('/dashboard');
      setOpen(false);
      setShowPassword(false);
      setShowUsername(true);
    }
  });

  const saveUserCtx = (newUser: userAccessProps) => {
    queryClient.removeQueries();
    postMenu.post({}, {}, newUser, newUser.access_token);
  };

  const verify = usePost({
    url: 'auth/validation',
    isGeneral: true,
    onSuccess: (data) => saveUserCtx(data)
  });

  const onCheck = (values: {username: string}) => {
    setUsername(values.username);
    const formValue = {
      username: values.username,
      language_id: 1,
      app: 'admin',
      send_code: false
    };
    check.post(formValue);
  };

  const onSubmit = (values: {password: any}) => {
    const formValue = {
      username,
      password: values.password,
      registered: true,
      language_id: 1,
      language: isEnLocale() ? 'en' : 'fa',
      app: 'admin'
    };
    verify.post(formValue);
  };

  useImperativeHandle(forwardedRef, () => ({
    open() {
      setOpen(true);
      !showUsername && setShowPassword(true);
      showPassword && setShowPassword(false);
    },
    close() {
      setOpen(false);
    }
  }));

  const onBackClick = () => {
    setShowPassword(false);
  };

  return (
    <Modal
      visible={open}
      centered
      title={tD('add_account')}
      bodyStyle={{padding: '8px'}}
      footer={false}
      style={{maxWidth: '400px'}}
      onCancel={() => {
        setOpen(false);
      }}>
      <CSSTransition
        in={showUsername}
        timeout={600}
        classNames="login"
        unmountOnExit
        onEnter={() => setShowPassword(false)}
        onExited={() => setShowPassword(true)}>
        <Form layout="vertical" requiredMark={false} name="login_username" className="my-5" onFinish={onCheck}>
          <Row gutter={[16, 8]} className="w-full m-0">
            <Col span={24} className="p-0">
              <Form.Item
                label={t('username')}
                name="username"
                rules={[{required: true, message: t('messages.required_username')}]}>
                <Input className="ltr-input" />
              </Form.Item>
            </Col>
          </Row>
          <Row className="py-4 ">
            <Button type="primary" htmlType="submit" loading={check.isLoading}>
              {t('continue')}
            </Button>
          </Row>
        </Form>
      </CSSTransition>
      <CSSTransition
        in={showPassword}
        timeout={600}
        classNames="login"
        unmountOnExit
        onEnter={() => setShowUsername(false)}
        onExited={() => setShowUsername(true)}>
        <Form layout="vertical" className="" requiredMark={false} name="login_password" onFinish={onSubmit}>
          <Button
            type="text"
            className="mr-auto d-flex"
            icon={<ArrowRightOutlined style={{color: 'gray', fontSize: 17}} />}
            onClick={onBackClick}
          />
          <Row className="w-full m-0">
            <Col span={24} className="p-0">
              <Form.Item
                label={t('password')}
                name="password"
                rules={[{required: true, message: t('messages.required_password')}]}>
                <Input.Password className="ltr-input" type="password" />
              </Form.Item>
            </Col>
          </Row>
          <Row className="py-4 ">
            <Button type="primary" htmlType="submit" loading={verify.isLoading || postMenu.isLoading}>
              {t('login')}
            </Button>
          </Row>
        </Form>
      </CSSTransition>
    </Modal>
  );
};

export default forwardRef(AddUserModal);
