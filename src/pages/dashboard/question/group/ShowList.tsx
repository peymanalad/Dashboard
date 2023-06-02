import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import {SearchQuestionGroup} from 'containers';

const ShowList: FC = () => {
  const {t} = useTranslation('question');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof SearchQuestionGroup>>(null);

  const deleteRequest = useDelete({
    url: '/question_groups/{id}',
    name: 'questionGroups'
  });

  const columns: any = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: t('specifications'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      responsive: ['sm'],
      render: (value: 'active' | 'inactive') => (
        <Tooltip title={t(value)}>
          {value === 'active' ? (
            <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 16}} />
          ) : (
            <CloseCircleOutlined style={{color: '#F44336', fontSize: 16}} />
          )}
        </Tooltip>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: any, questionGroup: any) => (
        <Space size={2}>
          {permissions?.questions && (
            <Tooltip title={t('go_questions')}>
              <Link to={`/question/question/list?group_id=${questionGroup?.id}`}>
                <Button type="text" icon={<QuestionCircleOutlined style={{color: '#0a8cac'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/question/group/edit/${questionGroup.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(questionGroup)}
                type="text"
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
      title={t('question_group')}
      extra={
        <Space>
          {hasPermission('questions.store') && (
            <Link to="/question/group/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_question_group')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchQuestionGroup ref={searchRef} />
      <CustomTable
        fetch="question_groups/paginate"
        dataName="questionGroups"
        rowClassName={(questionGroup: any) => `bg-${questionGroup?.status}`}
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
