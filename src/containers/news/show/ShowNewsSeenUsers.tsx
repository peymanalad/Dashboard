import React, {type FC} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Button, Image, Space, Tooltip} from 'antd';
import {EditOutlined, MailOutlined, BankOutlined, EyeOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {convertUtcTimeToLocal, getImageUrl} from 'utils';
import type {simplePermissionProps} from 'types/common';
import {DeedLogoImg} from 'assets';

interface Props {
  id?: string;
}

const ShowNewsSeenUsers: FC<Props> = ({id}) => {
  const {t} = useTranslation('user-show');

  const columns = [
    {
      title: t('profile'),
      dataIndex: 'profilePictureId',
      key: 'profilePictureId',
      className: 'pt-2 pb-0',
      align: 'center',
      render: (imageId: string) =>
        imageId ? (
          <Image
            preview={{
              className: 'custom-operation',
              mask: (
                <div className="w-full h-full bg-black opacity-75 flex flex-center">
                  <EyeOutlined className="text-yellow" />
                </div>
              )
            }}
            width={50}
            height={50}
            src={getImageUrl(imageId)}
            fallback={DeedLogoImg}
          />
        ) : (
          '-'
        )
    },
    {
      title: t('username'),
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      sorter: true
    },
    {
      title: t('nationalId'),
      dataIndex: 'nationalId',
      key: 'nationalId',
      align: 'center',
      sorter: true
    },
    {
      title: t('mobile'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
      sorter: true
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      sorter: true
    },
    {
      title: t('last_name'),
      dataIndex: 'surname',
      key: 'surname',
      align: 'center',
      sorter: true
    },
    {
      title: t('role'),
      dataIndex: ['roles', 0, 'roleName'],
      key: 'roles',
      align: 'center',
      sorter: false,
      render: (role?: string) => t(role || 'User')
    },
    {
      title: t('seen_at'),
      dataIndex: 'seenTime',
      key: 'seenTime',
      align: 'center',
      responsive: ['md'],
      sorter: true,
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, user: any) => (
        <Space size={2}>
          <Tooltip title={t('showOrganizationUsers')}>
            <Link to={`/user/show/${user?.userId}/organizations`}>
              <Button type="text" icon={<BankOutlined className="text-red" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('send_message')}>
            <Link to={`/message/friend/${user?.userId}`}>
              <Button type="text" icon={<MailOutlined className="text-orange" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('update')}>
            <Link to={`/user/edit/${user?.userId}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('profile')}>
            <Link to={`/user/show/${user?.userId}`}>
              <Button type="text" icon={<EyeOutlined className="text-orange" />} />
            </Link>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <CustomTable
      fetch="/services/app/Posts/GetSeenUsers"
      dataName={['news', id, 'SeenUsers']}
      query={{PostId: id}}
      columns={columns}
      hasIndexColumn
    />
  );
};

export default ShowNewsSeenUsers;
