import React, {useRef, ElementRef, FC} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete} from 'hooks';
import {Button, Card, Space, Tooltip} from 'antd';
import {DeleteOutlined, FilterOutlined, WhatsAppOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {convertUtcTimeToLocal} from 'utils';
import {SearchTemporary} from 'containers';
import {TemporaryUser} from 'types/user';
import toNumber from 'lodash/toNumber';

const ShowList: FC = () => {
  const {t} = useTranslation('user-show');
  const searchRef = useRef<ElementRef<typeof SearchTemporary>>(null);

  const deleteRequest = useDelete({
    url: '/temporaries/{id}',
    name: 'temporaries',
    titleKey: 'code'
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
      title: t('username'),
      dataIndex: 'username',
      key: 'username',
      align: 'center'
    },
    {
      title: t('code'),
      dataIndex: 'code',
      key: 'code',
      align: 'center'
    },
    {
      title: t('date'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      align: 'center',
      responsive: ['md'],
      render: (value: string) => convertUtcTimeToLocal(value)
    },
    {
      title: t('tries'),
      dataIndex: 'tries',
      key: 'tries',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: {delete: boolean}, temporary: TemporaryUser) => (
        <Space size={2}>
          {!!toNumber(temporary?.username) && (
            <Tooltip title={t('sendWhatsAppMessage')}>
              <Link
                to={{
                  pathname: `https://web.whatsapp.com/send?phone=98${temporary?.username}&text= سلام از دید پیام ارسال می کنیم`
                }}
                target="_blank">
                <Button type="text" icon={<WhatsAppOutlined style={{color: '#25d366'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Button
              type="text"
              onClick={() => deleteRequest.show(temporary)}
              icon={<DeleteOutlined style={{color: 'red'}} />}
            />
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
      title={t('temporary_users')}
      extra={
        <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
          {t('filter')}
        </Button>
      }>
      <SearchTemporary ref={searchRef} />
      <CustomTable
        fetch="temporaries/paginate"
        rowClassName={(temporary: any) => `bg-user-${temporary?.status}`}
        dataName="temporaries"
        columns={columns}
      />
    </Card>
  );
};
export default ShowList;
