import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {usePost} from 'hooks';
import {Button, Col, Form, Modal, Row} from 'antd';
import {MultiSelectPaginate} from 'components';
import {useTranslation} from 'react-i18next';
import {FormOutlined, SaveOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';

interface refProps {
  open: (organizationId: number, organizationLabel?: string) => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

interface Organization {
  id: number;
  label?: string;
}

const SetOrganizationModal: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('organization');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [form] = Form.useForm();

  const sendOrganizationUser = usePost({
    url: 'services/app/DeedCharts/SetOrganizationForChartLeaf',
    refetchQueries: ['OrganizationCharts'],
    form,
    onSuccess: () => {
      form.resetFields();
      setSelectedOrganization(null);
    }
  });

  useImperativeHandle(forwardedRef, () => ({
    open(id: number, label?: string) {
      setSelectedOrganization({id, label});
    },
    close() {
      setSelectedOrganization(null);
    }
  }));

  const onFinish = (values: any) => {
    if (!setSelectedOrganization) return;
    sendOrganizationUser.post({
      organizationId: values?.organization?.id,
      organizationChartId: Number(selectedOrganization?.id)
    });
  };

  return (
    <Modal
      open={!!selectedOrganization}
      title={t('setOrganization')}
      closable
      centered
      onCancel={() => {
        setSelectedOrganization(null);
      }}
      footer={null}>
      <Form form={form} layout="vertical" name="news" requiredMark={false} onFinish={onFinish}>
        <Row gutter={[16, 8]} className="w-full">
          <Col span={24}>
            <Form.Item
              name="organization"
              label={t('organization')}
              rules={[{required: true, message: t('messages.required')}]}>
              <MultiSelectPaginate
                mode="single"
                urlName="organizationGroupsSearch"
                url="services/app/GroupMembers/GetAllOrganizationGroupForLookupTable"
                keyValue="id"
                keyLabel="displayName"
                placeholder={t('choose')}
                showSearch={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5" justify="space-between">
          <Link
            to={{
              pathname: '/organization/organization/create',
              state: {organization: selectedOrganization}
            }}>
            <Button type="primary" className="d-block ant-btn-warning" icon={<FormOutlined />}>
              {t('add_organization')}
            </Button>
          </Link>
          <Button
            className="sm:w-unset"
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
export default forwardRef(SetOrganizationModal);
