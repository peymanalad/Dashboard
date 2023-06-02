import React, {FC} from 'react';
import {Form, Input, Button, Row, Col, Card, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {ArrowLeftOutlined} from '@ant-design/icons';

interface Props {
  onSubmit(values: any): void;
  isLoading: boolean;
  onBackClick: () => void;
}

const {Text} = Typography;

const LoginPassword: FC<Props> = ({onSubmit, isLoading, onBackClick}) => {
  const {t} = useTranslation('login');

  return (
    <Card
      className="mt-2"
      title={t('login_page')}
      extra={
        <Button
          type="text"
          icon={<ArrowLeftOutlined style={{color: 'gray', fontSize: 17}} />}
          onClick={() => {
            onBackClick();
          }}
        />
      }>
      <Form
        layout="vertical"
        className="my-5"
        requiredMark={false}
        name="login_password"
        onFinish={({password}) => onSubmit({password})}>
        <Row gutter={[16, 8]} className="w-full m-0">
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
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {t('login')}
          </Button>
        </Row>
      </Form>
      <Text className="mt-2 text-sm px-3" type="secondary" strong>
        {t('messages.support')}
      </Text>
    </Card>
  );
};
export default LoginPassword;
