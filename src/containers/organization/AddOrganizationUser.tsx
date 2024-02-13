import React, {
  type ForwardedRef,
  forwardRef,
  type ForwardRefRenderFunction,
  type RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {usePost} from 'hooks';
import {Button, Col, Form, Modal, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {SaveOutlined} from '@ant-design/icons';
import {MultiSelectPaginate} from 'components';

interface refProps {
  open: (organizationId: number) => void;
  close: () => void;
}

interface props {
  organizationId?: string;
  ref: RefObject<refProps>;
}

const AddOrganizationUserModal: ForwardRefRenderFunction<refProps, props> = (
  {organizationId}: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('organization');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const sendOrganizationUser = usePost({
    url: 'services/app/OrganizationUsers/CreateOrEdit',
    refetchQueries: ['OrganizationCharts'],
    removeQueries: [['GetAllUsersForLeaf', selectedOrganizationId]],
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
    sendOrganizationUser.post({
      userId: +values?.organizationUser?.userId,
      organizationChartId: selectedOrganizationId ? +selectedOrganizationId : null
    });
  };

  return (
    <Modal
      open={!!selectedOrganizationId}
      title={t('addOfficeUser')}
      closable
      centered
      destroyOnClose
      onCancel={() => {
        setSelectedOrganizationId(null);
      }}
      footer={null}>
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item label={t('user')} name="organizationUser">
              <MultiSelectPaginate
                mode="single"
                urlName="GetAllNoOrganization"
                url="services/app/GroupMembers/GetAllNoOrganization"
                params={{organizationId}}
                renderCustomLabel={(option) => {
                  return `${option?.name || ''} ${option?.surName || ''} - ${
                    option?.memberPosition ? `${option?.memberPosition} -` : ''
                  }  ${option?.organizationGroupName || ''}`;
                }}
                keyValue="userId"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch={false}
              />
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
export default forwardRef(AddOrganizationUserModal);
