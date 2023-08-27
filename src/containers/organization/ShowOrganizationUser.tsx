import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {Modal} from 'antd';
import {CustomTable} from 'components';
import {useTranslation} from 'react-i18next';

interface refProps {
  open: (organizationId: number) => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const ShowOrganizationUserModal: ForwardRefRenderFunction<refProps, props> = (
  props: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('organization');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);

  useImperativeHandle(forwardedRef, () => ({
    open(organizationId: number) {
      setSelectedOrganizationId(organizationId);
    },
    close() {
      setSelectedOrganizationId(null);
    }
  }));

  const columns: any = [
    {
      title: t('userId'),
      dataIndex: 'userId',
      key: 'userId',
      align: 'center'
    },
    {
      title: t('userName'),
      dataIndex: 'userName',
      key: 'userName',
      align: 'center'
    }
  ];

  return (
    <Modal
      open={!!selectedOrganizationId}
      title={t('showUsers')}
      width={700}
      closable
      centered
      onCancel={() => {
        setSelectedOrganizationId(null);
      }}
      footer={null}>
      <CustomTable
        fetch="services/app/OrganizationUsers/GetAllUsersForLeaf"
        query={{OrganizationChartId: selectedOrganizationId}}
        dataName={['GetAllUsersForLeaf', selectedOrganizationId]}
        columns={columns}
      />
    </Modal>
  );
};
export default forwardRef(ShowOrganizationUserModal);
