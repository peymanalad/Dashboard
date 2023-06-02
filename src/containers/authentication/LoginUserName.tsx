import React, {FC} from 'react';
import {Form, Input, Button, Row, Col, Image, Card, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {BehzeeLogoImg} from 'assets';

interface Props {
  onSubmit(values: any): void;
  isLoading: boolean;
}

const {Text} = Typography;

const LoginUserName: FC<Props> = ({onSubmit, isLoading}) => {
  const {t} = useTranslation('login');

  return (
    <Card className="mt-2" title={t('login_page')} extra={<Image preview={false} src={BehzeeLogoImg} width={30} />}>
      <Form
        layout="vertical"
        requiredMark={false}
        name="login_username"
        className="my-5"
        onFinish={({username}) => onSubmit({username})}>
        <Row gutter={[16, 8]} className="w-full m-0">
          <Col span={24}>
            <Form.Item
              label={t('username')}
              name="username"
              rules={[{required: true, message: t('messages.required_username')}]}>
              <Input className="ltr-input" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} justify="center" className="py-4">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {t('continue')}
          </Button>
        </Row>
      </Form>
      <Text className="mt-2 text-sm px-3" type="secondary" strong>
        {t('messages.support')}
      </Text>
    </Card>
  );
};
export default LoginUserName;
