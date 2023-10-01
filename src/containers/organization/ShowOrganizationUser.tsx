import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {useDelete} from 'hooks';
import {Button, Modal, Tooltip} from 'antd';
import {CustomTable} from 'components';
import {useTranslation} from 'react-i18next';
import {DeleteOutlined} from '@ant-design/icons';
import type {simplePermissionProps} from 'types/common';

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

  const deleteRequest = useDelete({
    url: '/services/app/OrganizationUsers/Delete',
    name: ['GetAllUsersForLeaf', selectedOrganizationId],
    titleKey: 'memberPosition'
  });

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
    },
    {
      title: t('firstName'),
      dataIndex: 'firstName',
      key: 'firstName',
      align: 'center'
    },
    {
      title: t('lastName'),
      dataIndex: 'lastName',
      key: 'firstName',
      align: 'center'
    },
    {
      title: t('organization_situation'),
      dataIndex: 'memberPosition',
      key: 'memberPosition',
      align: 'center',
      sorter: true
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, organizationUser: any) => (
        <Tooltip title={t('do_delete')}>
          <Button
            onClick={() => deleteRequest.show(organizationUser, {Id: organizationUser?.organizationUserId})}
            type="text"
            icon={<DeleteOutlined className="text-red" />}
          />
        </Tooltip>
      )
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
