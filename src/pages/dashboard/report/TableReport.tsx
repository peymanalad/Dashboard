import React, {FC, useState} from 'react';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';
import {Button, Card, Modal, Space, Tooltip} from 'antd';
import {CustomTable, JsonEditor} from 'components';
import {useTranslation} from 'react-i18next';
import isNil from 'lodash/isNil';

const TableReport: FC = () => {
  const {t} = useTranslation('reports');
  const [content, setContent] = useState<{title: string; detail: object} | null>(null);

  const columns = [
    {
      title: t('route_name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: t('name'),
      dataIndex: ['user', 'full_name'],
      key: 'user',
      align: 'center'
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center'
    },
    {
      title: t('duration'),
      dataIndex: 'duration',
      key: 'duration',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'response',
      key: 'response',
      render: (response: any, record: any) => (
        <Space size={2}>
          {record.request && (
            <Tooltip title={t('show_request')}>
              <Button
                type="text"
                style={{color: 'green'}}
                icon={<ArrowUpOutlined />}
                onClick={() => openModalHandler(record.request, 'show_request')}
              />
            </Tooltip>
          )}
          {record?.response && (
            <Tooltip title={t('show_response')}>
              <Button
                type="text"
                icon={<ArrowDownOutlined />}
                style={{color: '#f6830f'}}
                onClick={() => openModalHandler(record?.response, 'show_response')}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const openModalHandler = (detail: object, title: string) => {
    setContent({title, detail});
  };
  return (
    <Card title={t('requsets')}>
      <Modal
        title={t(content?.title || '')}
        visible={!isNil(content)}
        onCancel={() => {
          setContent(null);
        }}
        footer={null}>
        <div className="ltr">
          <JsonEditor style={{padding: 0, border: 'none'}} disableClipboard disable value={content?.detail || {}} />
        </div>
      </Modal>
      <CustomTable
        fetch="api_logs/paginate"
        rowClassName={(record: any) => `bg-${record?.is_active ? 'active' : 'inactive'}`}
        dataName="apiLogs"
        columns={columns}
      />
    </Card>
  );
};

export default TableReport;
