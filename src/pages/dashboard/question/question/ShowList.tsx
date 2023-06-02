import React, {FC, useRef, ElementRef} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete, useModifyQuery, usePost, useUser} from 'hooks';
import {CustomTable} from 'components';
import {Card, Space, Button, Tooltip} from 'antd';
import {FollowupIcon, MemoirIcon} from 'assets';
import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  SisternodeOutlined,
  CopyOutlined
} from '@ant-design/icons';
import {SearchQuestion} from 'containers';
import {getLangSearchParam} from 'utils';
import get from 'lodash/get';

const ShowList: FC = () => {
  const {t} = useTranslation('question');
  const history = useHistory();
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof SearchQuestion>>(null);
  const modifyQuery = useModifyQuery({
    queryName: 'questions'
  });

  const deleteRequest = useDelete({
    url: '/questions/{id}',
    name: 'questions',
    titleKey: 'title'
  });

  const copyQuestion = usePost({
    url: 'questions/{id}/copy',
    method: 'POST',
    onSuccess(data: any) {
      history.push(getLangSearchParam(`/question/question/edit/${data?.id}`));
    }
  });

  const changeQuestionStatus = usePost({
    url: 'questions/{id}/activation',
    method: 'POST',
    onSuccess(response: any, request?: any, params?: any) {
      modifyQuery.updateQuery({listPath: 'is_active'}, request?.is_active, ['id', params?.id]);
    }
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
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: t('group'),
      dataIndex: 'group_title',
      key: 'group_title',
      align: 'center',
      responsive: ['sm']
    },
    {
      title: t('disease'),
      dataIndex: ['disease', 'name'],
      key: 'disease',
      align: 'center'
    },
    {
      title: t('specifications'),
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      responsive: ['sm'],
      render: (value: boolean, item: any) => (
        <Space size={18}>
          <Tooltip title={value ? t('active') : t('inactive')}>
            {value ? (
              <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 18}} />
            ) : (
              <CloseCircleOutlined style={{color: '#F44336', fontSize: 18}} />
            )}
          </Tooltip>
          {item?.mode && (
            <Tooltip title={t(item?.mode)}>
              {item?.mode === 'followup' ? (
                <FollowupIcon style={{color: '#F44336', fontSize: 4}} />
              ) : (
                <MemoirIcon style={{color: '#4CAF50', fontSize: 4}} />
              )}
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
      render: (permissions: any, question: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/question/question/edit/${question.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                type="text"
                onClick={() => deleteRequest.show(question)}
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
          {permissions?.copy && (
            <Tooltip title={t('copy')}>
              <Button
                type="text"
                loading={copyQuestion?.isLoading && get(copyQuestion?.params, 'id') === question?.id}
                icon={<CopyOutlined className="text-primary" />}
                onClick={() => {
                  copyQuestion.post({}, {}, {id: question?.id});
                }}
              />
            </Tooltip>
          )}
          <Tooltip title={t('changeStatus')}>
            <Button
              type="text"
              loading={changeQuestionStatus?.isLoading && get(changeQuestionStatus?.params, 'id') === question?.id}
              icon={<SisternodeOutlined className="text-purple" />}
              onClick={() => {
                changeQuestionStatus.post({is_active: !question?.is_active}, {}, {id: question?.id});
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      title={t('questions')}
      extra={
        <Space size="small">
          {hasPermission('questions.store') && (
            <Link to="/question/question/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_question')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchQuestion ref={searchRef} />
      <CustomTable
        fetch="questions/paginate"
        rowClassName={(question: any) => `bg-${question?.is_active}`}
        dataName="questions"
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
