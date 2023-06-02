import React, {useState, FC, useRef, ElementRef} from 'react';
import {Link} from 'react-router-dom';
import {usePost, useUser} from 'hooks';
import {useTranslation} from 'react-i18next';
import {convertMiladiToShamsiiiYear, convertUtcTimeToLocal} from 'utils';
import {Button, Card, Space, Tooltip, Modal, Typography, Popover} from 'antd';
import {
  FormOutlined,
  FilterOutlined,
  EditOutlined,
  DiffOutlined,
  EyeOutlined,
  MobileOutlined,
  DeleteOutlined,
  UploadOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import {CustomTable, CustomUpload, UserDropDownMenu} from 'components';
import {NoteModal, SearchUsers} from 'containers';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import map from 'lodash/map';
import range from 'lodash/range';
import {userProps} from 'types/user';

const {Text} = Typography;

const UserShowList: FC = () => {
  const {t} = useTranslation('user-show');
  const searchRef = useRef<ElementRef<typeof SearchUsers>>(null);
  const tableRef = useRef<ElementRef<typeof CustomTable>>(null);
  const noteModalRef = useRef<any>(null);
  const {hasPermission} = useUser();
  const [note, setNote] = useState<string | undefined>(undefined);

  const postExcl = usePost({
    url: 'users/import',
    method: 'POST',
    refetchQueries: ['users']
  });

  const onClickShowNote = (detail: string | null) => () => {
    setNote(detail || '');
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('mobile'),
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center'
    },
    {
      title: t('full_name'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.name
    },
    {
      title: t('role'),
      dataIndex: ['role', 'title'],
      key: 'role',
      align: 'center'
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      responsive: ['sm'],
      render: (status: any) => <Text className={`p-user-${status}`}>{t(`statuses.${status}`)}</Text>
    },
    {
      title: t('seen_at'),
      dataIndex: 'seen_at',
      key: 'seen_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'HH:mm jYY/jMM/jDD') : '-')
    },
    {
      title: t('call'),
      dataIndex: 'calls',
      key: 'calls',
      align: 'center',
      render: (calls: any, user: any) => (
        <Space
          onClick={calls.length < 3 ? () => openNoteModal(user?.id, calls) : undefined}
          className={`${calls.length < 3 ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
          {map(range(3), (item) => (
            <Popover
              visible={!!get(calls, [item, 'note']) ? undefined : false}
              content={
                <Space className="d-flex flex-col w-full">
                  <p className="text-xs text-right w-full">{get(calls, [item, 'note'])}</p>
                  <div className="text-xs w-full text-left text-grayDark">
                    {convertMiladiToShamsiiiYear(get(calls, [item, 'date']))}
                  </div>
                </Space>
              }>
              <div className={`calls-circle ${calls.length > item ? 'active' : ''}`} />
            </Popover>
          ))}
        </Space>
      )
    },
    {
      title: t('specifications'),
      dataIndex: 'specifications',
      key: 'specifications',
      align: 'center',
      responsive: ['sm'],
      render: (permissions: any, user: any) => (
        <Space size={2}>
          {user?.note && (
            <Tooltip title={t('note')}>
              <Button
                type="text"
                icon={<DiffOutlined style={{color: '#625772', fontSize: 18}} />}
                onClick={onClickShowNote(user?.note)}
              />
            </Tooltip>
          )}
          {user?.deleted_at && (
            <Tooltip title={t('deleted_at') + convertUtcTimeToLocal(user?.deleted_at, 'jYYYY/jMM/jDD')}>
              <DeleteOutlined style={{color: '#F44336', fontSize: 18}} />
            </Tooltip>
          )}
          {user?.device && (
            <Tooltip
              title={
                <div className="flex-center">
                  {t([user?.device?.platform])}
                  {user?.device?.version && `(${user?.device?.version})`}
                </div>
              }>
              <Button type="text" style={{color: '#ff7f50'}} icon={<MobileOutlined />} />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: any, user: userProps) => {
        // const {whatsapp, ...rest} = permissions;
        return (
          <Space size={2}>
            {permissions?.['whatsapp.view'] && (
              <Tooltip title={t('sendWhatsAppMessage')}>
                <Link
                  to={{
                    pathname: `https://web.whatsapp.com/send?phone=98${user?.mobile}&text= سلام از بهزی پیام ارسال می کنیم`
                  }}
                  target="_blank">
                  <Button type="text" icon={<WhatsAppOutlined style={{color: '#25d366'}} />} />
                </Link>
              </Tooltip>
            )}
            {permissions?.view && (
              <Tooltip title={t('view')}>
                <Link to={`/user/show/${user?.id}`}>
                  <Button type="text" icon={<EyeOutlined style={{color: '#f6830f'}} />} />
                </Link>
              </Tooltip>
            )}
            {permissions?.update && (
              <Tooltip title={t('update')}>
                <Link to={`/user/edit/${user?.id}`}>
                  <Button type="text" style={{color: '#035aa6'}} icon={<EditOutlined />} />
                </Link>
              </Tooltip>
            )}
            <UserDropDownMenu user={user} permissions={permissions} />
          </Space>
        );
      }
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  const openNoteModal = (id: any, calls: any) => {
    if (noteModalRef.current) noteModalRef.current.open(id, calls);
  };

  return (
    <Card
      extra={
        <Space size="small">
          <CustomUpload
            typeFile="excel"
            mode="single"
            type="configs"
            listType="text"
            showUploadList={false}
            uploadButton={(isLoading: boolean, disabled?: boolean) => (
              <Button
                className="ant-btn-success d-text-none md:d-text-unset"
                loading={isLoading || postExcl?.isLoading}
                disabled={disabled}
                icon={<UploadOutlined />}>
                {t('upload')}
              </Button>
            )}
            onUpload={(file) => {
              postExcl.post({path: file.path});
            }}
          />
          {hasPermission('users.store') && (
            <Link to="/user/create">
              <Button className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset" icon={<FormOutlined />}>
                {t('add')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }
      className="my-6"
      title={t('title')}>
      <Modal
        title={t('note')}
        visible={!isNil(note)}
        onCancel={() => {
          setNote(undefined);
        }}
        footer={null}>
        <Text>{note}</Text>
      </Modal>
      <SearchUsers ref={searchRef} />
      <NoteModal ref={noteModalRef} tableRef={tableRef} />
      <CustomTable
        fetch="users/paginate"
        rowClassName={(user) => `bg-user-${user?.status}`}
        dataName="users"
        columns={columns}
        ref={tableRef}
      />
    </Card>
  );
};

export default UserShowList;
