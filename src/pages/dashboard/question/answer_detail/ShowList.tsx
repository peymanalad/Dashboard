import React, {ElementRef, FC, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {convertUtcTimeToLocal} from 'utils';
import {Button, Card, Modal, Space, Tooltip, Typography} from 'antd';
import {FilterOutlined, DiffOutlined, EyeOutlined, LikeOutlined} from '@ant-design/icons';
import {CustomTable} from 'components';
import {SearchAnswer, SearchAnswerDetail} from 'containers';
import isEmpty from 'lodash/isEmpty';
import {userProps} from 'types/user';
import {get} from 'lodash';

const {Text, Title} = Typography;

const ShowList: FC = () => {
  const {t} = useTranslation('question');
  const [questionDetail, setQuestionDetail] = useState<{question: string; answer: string} | undefined>(undefined);
  const searchRef = useRef<ElementRef<typeof SearchAnswer>>(null);

  const onClickShowContent = (answer: any) => () => {
    setQuestionDetail({question: answer?.question?.title, answer: answer?.answer});
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.username || '-'
    },
    {
      title: t('doctor'),
      dataIndex: 'doctor',
      key: 'doctor',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.username || '-'
    },
    {
      title: t('reviewer'),
      dataIndex: 'reviewer',
      key: 'reviewer',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.username || '-'
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => (dateTime ? convertUtcTimeToLocal(dateTime, 'jYYYY/jMM/jDD HH:mm') : '-')
    },
    {
      title: `${t('specifications')}`,
      dataIndex: 'specifications',
      key: 'specifications',
      align: 'center',
      render: (specifications: any, answer: any) => (
        <Space size="small">
          <Tooltip title={t('detail')}>
            <Button
              type="text"
              icon={<DiffOutlined style={{color: '#625772'}} />}
              onClick={onClickShowContent(answer)}
            />
          </Tooltip>
          {get(answer, ['permissions', 'review']) && (
            <Tooltip title={t('reviewed')}>
              <Button type="text" icon={<LikeOutlined className="text-green" />} />
            </Tooltip>
          )}
          {get(answer, ['permissions', 'view']) && (
            <Tooltip title={t('view')}>
              <Button
                type="text"
                icon={<EyeOutlined className="text-orange" />}
                href={`/question/answer_detail/show/${answer.id}`}
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
      title={t('answers')}
      extra={
        <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
          {t('filter')}
        </Button>
      }>
      <Modal
        title={t('detail')}
        visible={!isEmpty(questionDetail)}
        onCancel={() => {
          setQuestionDetail(undefined);
        }}
        footer={null}>
        <Space direction="vertical" align="start" size="small">
          <Title level={5}>{questionDetail?.question}</Title>
          <Text type="secondary">{questionDetail?.answer || t('not_answer')}</Text>
        </Space>
      </Modal>
      <SearchAnswerDetail ref={searchRef} />
      <CustomTable fetch="answer_details/paginate" dataName="answers_detail" columns={columns} />
    </Card>
  );
};

export default ShowList;
