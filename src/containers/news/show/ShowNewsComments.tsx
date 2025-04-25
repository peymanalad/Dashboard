import React, {FC} from 'react';
import {Button, Space, Tooltip} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {useDelete} from 'hooks';
import {convertUtcTimeToLocal} from 'utils';

interface Props {
  id?: string;
}

const ShowNewsComments: FC<Props> = ({id}) => {
  const {t} = useTranslation('comments');

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
      dataIndex: ['comment', 'commentCaption'],
      key: 'commentCaption',
      align: 'center',
      render: (commentCaption: string, comment: any) => (
        <Space size={2}>
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
    <CustomTable
      fetch="services/app/Comments/GetListOfComments"
      dataName={['news', id, 'comments']}
      columns={columns}
      query={{PostId: id}}
    />
  );
};

export default ShowNewsComments;
