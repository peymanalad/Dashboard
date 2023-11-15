import React, {type FC} from 'react';
import {Button, Card, Image, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, SearchButton} from 'components';
import {useDelete, usePost, useUser} from 'hooks';
import type {simplePermissionProps} from 'types/common';
import {getImageUrl, getTempFileUrl, queryStringToObject} from 'utils';
import {DeedLogoImg} from 'assets';

const ShowList: FC = () => {
  const {t} = useTranslation('news');
  const {hasPermission, isSuperUser} = useUser();
  const location = useLocation();

  const fetchExcel = usePost({
    url: 'services/app/PostGroups/GetPostGroupsToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: '/services/app/PostGroups/Delete',
    name: 'newsGroups',
    titleKey: 'newsName'
  });

  const columns: any = [
    {
      title: t('image'),
      dataIndex: ['postGroup', 'groupFile'],
      key: 'image',
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
      title: t('name'),
      dataIndex: ['postGroup', 'postGroupDescription'],
      key: 'name',
      align: 'center'
    },
    {
      title: t('organization'),
      dataIndex: 'organizationGroupGroupName',
      key: 'group',
      align: 'center'
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, newsGroup: any) => (
        <Space size={2}>
          <Tooltip title={t('update')}>
            <Link to={`/organization/group/edit/${newsGroup.postGroup?.id}`}>
              <Button type="text" icon={<EditOutlined className="text-blueDark" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(newsGroup.postGroup, {Id: newsGroup.postGroup?.id})}
              type="text"
              icon={<DeleteOutlined className="text-red" />}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Card
      title={t('news_groups')}
      extra={
        <Space size="small">
          <Button
            className="ant-btn-success d-text-none md:d-text-unset"
            type="primary"
            icon={<FileExcelOutlined />}
            loading={fetchExcel.isLoading}
            onClick={() => {
              fetchExcel.post({}, queryStringToObject(location.search));
            }}>
            {t('excel')}
          </Button>
          {!hasPermission('news.store') && (
            <Link to="/organization/group/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_news_group')}
              </Button>
            </Link>
          )}
          <SearchButton />
        </Space>
      }>
      <CustomTable
        fetch="services/app/PostGroups/GetAll"
        dataName="postGroups"
        columns={columns}
        hasIndexColumn
        hasOrganization
        selectOrganizationProps={{hasAll: isSuperUser()}}
      />
    </Card>
  );
};

export default ShowList;
