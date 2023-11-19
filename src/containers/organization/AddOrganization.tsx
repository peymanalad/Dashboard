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
  open: (node: any, isEdit?: boolean) => void;
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
  const [selectedOrganization, setSelectedOrganization] = useState<any | null>(null);
  const [form] = Form.useForm();

  const sendOrganizationUser = usePost({
    url: `services/app/${!!organizationId ? 'OrganizationCharts' : 'DeedCharts'}/CreateOrEdit`,
    refetchQueries: organizationId ? ['OrganizationChart', organizationId] : ['OrganizationCharts'],
    form,
    onSuccess: () => {
      form.setFieldsValue({caption: ''});
      setSelectedOrganization(null);
    }
  });

  useImperativeHandle(forwardedRef, () => ({
    open(node: any, isEdit: boolean = false) {
      setSelectedOrganization({...node, isEdit});
      form.setFieldsValue({caption: isEdit ? node?.label || node?.caption : ''});
    },
    close() {
      form.setFieldsValue({caption: ''});
      setSelectedOrganization(null);
    }
  }));

  const onFinish = (values: any) => {
    if (!selectedOrganization) return;
    if (selectedOrganization?.isEdit) {
      values.id = +selectedOrganization?.id;
      values.parentId = selectedOrganization?.parentId ? +selectedOrganization?.parentId : null;
      values.leafPath = selectedOrganization?.leafPath;
    } else values.parentId = selectedOrganization?.id ? +selectedOrganization?.id : null;
    values.organizationId =
      organizationId || selectedOrganization?.organizationId
        ? Number(organizationId || selectedOrganization?.organizationId)
        : null;
    sendOrganizationUser.post(values);
  };

  return (
    <Modal
      open={!!selectedOrganization}
      title={t(!!organizationId ? 'addOrganizationChart' : 'addSubset')}
      destroyOnClose
      closable
      centered
      onCancel={() => {
        form.setFieldsValue({caption: ''});
        setSelectedOrganization(null);
      }}
      footer={null}>
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item
              name="caption"
              label={t('name')}
              initialValue={selectedOrganization?.label || selectedOrganization?.caption}
              rules={[{required: true, message: t('messages.required')}]}>
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
