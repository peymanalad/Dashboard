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
  open: (organizationId: number) => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SetOrganizationModal: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('organization');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const sendOrganizationUser = usePost({
    url: 'services/app/DeedCharts/SetOrganizationForChartLeaf',
    refetchQueries: ['OrganizationCharts'],
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
    sendOrganizationUser.post({organizationId: values?.organization?.id, organizationChartId: +selectedOrganizationId});
  };

  return (
    <Modal
      open={!!selectedOrganizationId}
      title={t('setOrganization')}
      closable
      centered
      onCancel={() => {
        setSelectedOrganizationId(null);
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
          <Link to="/organization/organization/create">
            <Button
              type="primary"
              className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
              icon={<FormOutlined />}>
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
