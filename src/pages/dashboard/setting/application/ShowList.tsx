import React, {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {Button, Card, Modal, Space, Tooltip, Typography} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  DeleteOutlined,
  AndroidOutlined,
  WindowsOutlined,
  AppleOutlined,
  DiffOutlined,
  LinkOutlined
} from '@ant-design/icons';
import {CustomTable} from 'components';
import {useDelete} from 'hooks';
import {RequiredIcon} from 'assets';
import isEmpty from 'lodash/isEmpty';
import {validURL} from 'utils';

const {Text} = Typography;

const ShowList: FC = () => {
  const {t} = useTranslation('setting');
  const [content, setContent] = useState<string | undefined>();

  const deleteRequest = useDelete({
    url: 'services/app/SoftwareUpdates/Delete',
    name: 'softwareUpdates',
    titleKey: 'buildNo'
  });

  const onClickShowContent = (detail: string | null) => () => {
    setContent(detail || '');
  };

  const columns: any = [
    {
      title: t('os'),
      dataIndex: ['softwareUpdate', 'platform'],
      key: 'platform',
      align: 'center',
      render: (value: 'android' | 'ios' | 'windows') => (
        <Tooltip title={t(value)}>
          {value === 'android' && <AndroidOutlined style={{color: '#8FBC46', fontSize: 25}} />}
          {value === 'ios' && <AppleOutlined style={{color: '#A3ABB2', fontSize: 25}} />}
          {value === 'windows' && <WindowsOutlined style={{color: '#00A8E8', fontSize: 25}} />}
        </Tooltip>
      )
    },
    {
      title: t('version'),
      dataIndex: ['softwareUpdate', 'softwareVersion'],
      key: 'softwareUpdate',
      align: 'center'
    },
    {
      title: t('build_number'),
      dataIndex: ['softwareUpdate', 'buildNo'],
      key: 'buildNo',
      align: 'center'
    },
    {
      title: t('specifications'),
      dataIndex: ['softwareUpdate', 'forceUpdate'],
      key: 'required',
      align: 'center',
      responsive: ['sm'],
      render: (forceUpdate: any, softwareUpdate: any) => (
        <Space size={2}>
          {!!forceUpdate && (
            <Tooltip title={t('required')}>
              <RequiredIcon style={{fontSize: 16}} />
            </Tooltip>
          )}
          {softwareUpdate?.softwareUpdate?.whatsNew?.length && (
            <Tooltip title={t('changes')}>
              <Button
                type="text"
                icon={<DiffOutlined style={{color: '#625772'}} />}
                onClick={onClickShowContent(softwareUpdate?.softwareUpdate?.whatsNew)}
              />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: t('actions'),
      dataIndex: ['softwareUpdate', 'updatePath'],
      key: 'updatePath',
      align: 'center',
      render: (updatePath: string, softwareUpdate: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/setting/application/edit/${softwareUpdate?.softwareUpdate?.id}`}>
              <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() =>
                deleteRequest.show(softwareUpdate?.softwareUpdate, {Id: softwareUpdate.softwareUpdate?.id})
              }
              type="text"
              icon={<DeleteOutlined style={{color: 'red'}} />}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Card
      title={t('title')}
      extra={
        <Link to="/setting/application/create">
          <Button
            type="primary"
            className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
            icon={<FormOutlined />}>
            {t('add_application')}
          </Button>
        </Link>
      }>
      <Modal
        title={t('changes')}
        visible={!isEmpty(content)}
        onCancel={() => {
          setContent(undefined);
        }}
        footer={null}>
        <Text type="secondary">{content}</Text>
      </Modal>
      <CustomTable fetch="services/app/SoftwareUpdates/GetAll" dataName="softwareUpdates" columns={columns} />
    </Card>
  );
};

export default ShowList;
