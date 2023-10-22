import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {usePost} from 'hooks';
import {Button, Col, Form, Input, Modal, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {SaveOutlined} from '@ant-design/icons';

interface refProps {
  open: (organizationId: number) => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
  organizationId?: string;
}

const AddOrganizationModal: ForwardRefRenderFunction<refProps, props> = (
  {organizationId}: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('organization');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const sendOrganizationUser = usePost({
    url: `services/app/${!!organizationId ? 'OrganizationCharts' : 'DeedCharts'}/CreateOrEdit`,
    refetchQueries: organizationId ? ['OrganizationChart', organizationId] : ['OrganizationCharts'],
    form,
    onSuccess: () => {
      form.resetFields();
      setSelectedOrganizationId(null);
    }
  });

  useImperativeHandle(forwardedRef, () => ({
    open(organizationId: number) {
      setSelectedOrganizationId(organizationId);
    },
    close() {
      setSelectedOrganizationId(null);
    }
  }));

  const onFinish = (values: any) => {
    if (!selectedOrganizationId) return;
    sendOrganizationUser.post({...values, parentId: +selectedOrganizationId, organizationId});
  };

  return (
    <Modal
      open={!!selectedOrganizationId}
      title={t('addSubset')}
      closable
      centered
      onCancel={() => {
        setSelectedOrganizationId(null);
      }}
      footer={null}>
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item name="caption" label={t('name')} rules={[{required: true, message: t('messages.required')}]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            loading={sendOrganizationUser.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};
export default forwardRef(AddOrganizationModal);
