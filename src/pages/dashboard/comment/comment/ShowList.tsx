import React, {type FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {DeleteOutlined, EyeOutlined, FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, SearchButton} from 'components';
import {useDelete, usePost, useUser} from 'hooks';
import {convertUtcTimeToLocal, getTempFileUrl, queryStringToObject} from 'utils';
import type {simplePermissionProps} from 'types/common';

const ShowList: FC = () => {
  const {t} = useTranslation('comments');
  const location = useLocation();
  const {isSuperUser} = useUser();

  const fetchExcel = usePost({
    url: 'services/app/Comments/GetCommentsToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  const deleteRequest = useDelete({
    url: '/services/app/Comments/Delete',
    name: 'comments',
    titleKey: 'commentCaption'
  });

  const columns: any = [
    {
      title: t('comment'),
      dataIndex: ['comment', 'commentCaption'],
      key: 'commentCaption',
      sorter: true,
      align: 'center'
    },
    {
      title: t('news'),
      dataIndex: 'postPostTitle',
      key: 'postPostTitle',
      sorter: true,
      align: 'center'
    },
    {
      title: t('user'),
      dataIndex: 'userName',
      key: 'userName',
      sorter: true,
      align: 'center'
    },
    {
      title: t('created_at'),
      dataIndex: ['comment', 'insertDate'],
      key: 'insertDate',
      align: 'center',
      sorter: true,
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: simplePermissionProps, comment: any) => (
        <Space size={2}>
          <Tooltip title={t('newsProfile')}>
            <Link to={`/news/news/show/${comment?.postId}`}>
              <Button type="text" icon={<EyeOutlined className="text-orange" />} />
            </Link>
          </Tooltip>
          <Tooltip title={t('do_delete')}>
            <Button
              onClick={() => deleteRequest.show(comment.comment, {Id: comment.comment?.id})}
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
      title={t('comments')}
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
          <SearchButton />
        </Space>
      }>
      <CustomTable
        fetch="services/app/Comments/GetAll"
        dataName="comments"
        columns={columns}
        hasOrganization
        selectOrganizationProps={{hasAll: isSuperUser()}}
      />
    </Card>
  );
};

export default ShowList;
