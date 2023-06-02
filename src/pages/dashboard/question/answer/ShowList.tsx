import React, {ElementRef, FC, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {convertUtcTimeToLocal} from 'utils';
import {Button, Card, Modal, Space, Tooltip, Typography} from 'antd';
import {FilterOutlined, DiffOutlined} from '@ant-design/icons';
import {CustomTable, UserDropDownMenu} from 'components';
import {SearchAnswer} from 'containers';
import isEmpty from 'lodash/isEmpty';
import {userProps} from 'types/user';

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
      title: t('full_name'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps) => user?.full_name || user?.username || '-'
    },
    {
      title: `${t('question_group')}`,
      dataIndex: ['question_group', 'title'],
      key: 'question_group',
      align: 'center'
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
      title: t('answer_at'),
      dataIndex: 'answer_at',
      key: 'answer_at ',
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
        <Space>
          <Tooltip title={t('detail')}>
            <Button
              type="text"
              icon={<DiffOutlined style={{color: '#625772'}} />}
              onClick={onClickShowContent(answer)}
            />
          </Tooltip>
          <UserDropDownMenu
            user={answer?.user}
            permissions={{
              view: true,
              'visits.view': true,
              'visits.store': true,
              'orders.view': true,
              'orders.store': true,
              'support_messages.view': true,
              send_sms: true
            }}
          />
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
      <SearchAnswer ref={searchRef} />
      <CustomTable fetch="answers/paginate" dataName="answers" columns={columns} />
    </Card>
  );
};

export default ShowList;
