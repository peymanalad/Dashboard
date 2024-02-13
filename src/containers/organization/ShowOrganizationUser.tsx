import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import AddOrganizationGlobalUser from 'containers/organization/AddOrganizationGlobalUser';
import {useDelete} from 'hooks';
import {useParams} from 'react-router-dom';
import {Button, Modal, Tooltip} from 'antd';
import {CustomTable} from 'components';
import {useTranslation} from 'react-i18next';
import {DeleteOutlined, FormOutlined} from '@ant-design/icons';
import type {simplePermissionProps} from 'types/common';

interface refProps {
  open: (organizationId: number) => void;
  close: () => void;
}

interface props {
  isGlobal?: boolean;
  ref: RefObject<refProps>;
}

const ShowOrganizationUserModal: ForwardRefRenderFunction<refProps, props> = (
  {isGlobal}: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('organization');
  const addOrganizationRef = useRef<ElementRef<typeof AddOrganizationGlobalUser>>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
  const {id} = useParams<{id?: string}>();

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
            onClick={() =>
              deleteRequest.show(organizationUser, {
                Id: isGlobal ? organizationUser?.userId : organizationUser?.organizationUserId
              })
            }
            type="text"
            icon={<DeleteOutlined className="text-red" />}
          />
        </Tooltip>
      )
    }
  ];

  const onAdd = () => {
    if (addOrganizationRef.current && selectedOrganizationId)
      addOrganizationRef.current.open(Number(id || selectedOrganizationId));
  };

  return (
    <>
      <Modal
        open={!!selectedOrganizationId}
        title={t(isGlobal ? 'show_globalUsers' : 'showOfficeUsers')}
        width={700}
        closable
        centered
        onCancel={() => {
          setSelectedOrganizationId(null);
        }}
        footer={
          isGlobal ? (
            <Button type="primary" className="d-block ant-btn-warning" onClick={onAdd} icon={<FormOutlined />}>
              {t('add_globalUser')}
            </Button>
          ) : null
        }>
        <CustomTable
          fetch={
            isGlobal
              ? 'services/app/OrganizationUsers/GetGlobalUserLeaves'
              : 'services/app/OrganizationUsers/GetAllUsersInLeaf'
          }
          query={{OrganizationChartId: selectedOrganizationId, OrganizationId: id || selectedOrganizationId}}
          dataName={
            isGlobal ? ['GetGlobalUserLeaves', selectedOrganizationId] : ['GetAllUsersForLeaf', selectedOrganizationId]
          }
          columns={columns}
        />
      </Modal>
      <AddOrganizationGlobalUser ref={addOrganizationRef} />
    </>
  );
};
export default forwardRef(ShowOrganizationUserModal);
