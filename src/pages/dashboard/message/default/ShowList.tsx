import React, {ElementRef, FC, useRef} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete, useUser} from 'hooks';
import {CustomTable} from 'components';
import {Card, Space, Button, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, FormOutlined, FilterOutlined} from '@ant-design/icons';
import {SearchDefaultMessage} from 'containers';
import {simplePermissionProps} from 'types/common';

const DefaultMessageView: FC = () => {
  const {t} = useTranslation('message');
  const searchRef = useRef<ElementRef<typeof SearchDefaultMessage>>(null);
  const {hasPermission} = useUser();

  const deleteRequest = useDelete({
    url: '/default_question_messages/{id}',
    name: 'default_question_messages'
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('question'),
      dataIndex: 'question_title',
      key: 'question_title',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, message: any) => (
        <Space size={2}>
          {message?.permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/message/default/edit/${message.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {message?.permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                type="text"
                onClick={() => deleteRequest.show(message)}
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      title={t('defaultMessage')}
      extra={
        <Space size="small">
          {hasPermission('default_question_messages.store') && (
            <Link to="/message/default/create">
              <Button type="primary" className="ant-btn-warning" icon={<FormOutlined />}>
                {t('add_defaultMessage')}
              </Button>
            </Link>
          )}
          <Button type="primary" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchDefaultMessage ref={searchRef} />
      <CustomTable fetch="default_question_messages/paginate" dataName="default_question_messages" columns={columns} />
    </Card>
  );
};

export default DefaultMessageView;
