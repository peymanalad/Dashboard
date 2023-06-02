import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch, useInfinite} from 'hooks';
import {Spin, Card, Tree, Row, Input, Col} from 'antd';
import map from 'lodash/map';

export interface props {
  id?: string;
}

const QuestionInfo: FC<props> = ({id}) => {
  const {Search} = Input;
  const {t} = useTranslation('question');

  const [doctorQuestions, setDoctorQuestions] = useState<any>();

  const fetchDoctorQuestions = useFetch({
    url: 'users/{id}/questions',
    name: ['user', id, 'questions'],
    params: {id},
    enabled: true
  });

  const fetchQuestionGroup = useInfinite({
    url: 'question_groups/paginate',
    name: 'questions',
    isGeneral: true,
    enabled: true,
    params: {
      question: 1
    }
  });

  useEffect(() => {
    if (!doctorQuestions) {
      setDoctorQuestions(fetchDoctorQuestions?.data);
    }
  }, [doctorQuestions, fetchDoctorQuestions.data]);

  const createChildren = (data: any) => {
    const newChildren: any[] = [];
    if (data?.children) {
      map(data?.children, (child: any) => {
        newChildren.push({
          title: child.title,
          key: `parent-${child.id}`,
          children: createChildren(child)
        });
      });
    }
    if (data?.questions) {
      map(data?.questions, (question: any) => {
        newChildren.push({
          title: question.title,
          key: question.id
        });
      });
    }
    return newChildren;
  };

  const CustomSelectData = (data: any) => {
    const newData: any[] = [];
    if (data) {
      for (let i = 0; i < data?.length; i++) {
        newData.push({
          key: `parent_top_${data[i].id}`,
          title: data[i].title,
          children: createChildren(data[i])
        });
      }
    }
    return newData;
  };

  const TreeNodesId = () => {
    const newCheckedData: any[] = [];
    map(fetchDoctorQuestions?.data?.questions, (question: any) => {
      newCheckedData.push(question?.id);
    });
    return newCheckedData;
  };

  return (
    <Row>
      <Card bordered={false} className="w-full">
        <Row>
          <Col xs={24} sm={12} md={8}>
            <Search
              style={{marginBottom: 8}}
              placeholder={t('search')}
              className="h-full"
              onSearch={(event) => {
                fetchQuestionGroup.fetch({}, {search: event});
              }}
            />
          </Col>
        </Row>
        {fetchQuestionGroup.isFetching || fetchDoctorQuestions.isFetching ? (
          <Spin size="small" />
        ) : (
          <Row>
            <Tree
              showLine={{
                showLeafIcon: false
              }}
              showIcon={false}
              checkable
              disabled
              defaultCheckedKeys={TreeNodesId()}
              treeData={CustomSelectData(fetchQuestionGroup?.data)}
            />
          </Row>
        )}
      </Card>
      <Card title={t('alert_questions')} bordered={false} className="w-full my-20">
        {fetchDoctorQuestions.isFetching || !doctorQuestions ? (
          <Spin size="small" />
        ) : (
          <div className="flex-center w-full flex-col">
            <Row gutter={[16, 8]} className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
              <Col xs={24} md={18}>
                {t('question')}
              </Col>
              <Col xs={24} md={6}>
                {t('answer')}
              </Col>
            </Row>
            {doctorQuestions?.alert_questions?.map((item: any, index: number) => (
              <Row
                gutter={[16, 8]}
                key={index.toString()}
                className="w-full p-3 border-1 border-gainsBoro border-solid"
                style={{borderTopWidth: 0}}>
                <Col xs={24} md={18}>
                  <p className="value-show-info m-0">{item.title || '-'}</p>
                </Col>
                <Col xs={24} md={6}>
                  <p className="value-show-info m-0">
                    {item?.options.filter((option: any) => option?.id === item?.value)[0].name}
                  </p>
                </Col>
              </Row>
            ))}
            <Row className="w-full mt-5">
              <Col span={24}>
                <div className="flex flex-col">
                  <h1>{t('extra_questions')}</h1>
                  <p className="value-show-info">{doctorQuestions?.extra_questions?.join(' ، ') || '-'}</p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card>
    </Row>
  );
};

export default QuestionInfo;
