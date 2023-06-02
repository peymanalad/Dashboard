import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch, useInfinite} from 'hooks';
import {Spin, Card, Tree, Row, Col, Input} from 'antd';
import map from 'lodash/map';

interface Props {
  id?: string;
}

const {Search} = Input;

const QuestionInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');
  const [visitQuestions, setVisitQuestions] = useState<any>([]);

  const fetchQuestions = useInfinite({
    url: 'question_groups/paginate',
    params: {
      question: 1
    },
    enabled: true
  });

  const fetchVisitQuestions = useFetch({
    name: ['visit', 'question', id],
    url: 'visits/{id}/questions',
    params: {id},
    enabled: true
  });

  useEffect(() => {
    if (!visitQuestions) {
      setVisitQuestions(fetchVisitQuestions?.data);
    }
  }, [fetchVisitQuestions.data, visitQuestions]);

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

  const ChangeTree = (checkedKeys: any, info: any) => {
    const newNodes: any[] = [];
    map(info.checkedNode, (node: any) => {
      if (typeof node.key === 'number') {
        newNodes.push({
          title: node.title,
          id: node.key
        });
      }
    });
    setVisitQuestions(newNodes);
  };

  const TreeNodesId = () => {
    const newCheckedData: any[] = [];
    map(fetchVisitQuestions?.data, (question: any) => {
      newCheckedData.push(question?.id);
    });
    return newCheckedData;
  };

  return (
    <Card title={t(id ? 'edit_file.title' : 'create.title')} bordered={false} className="w-full">
      <Row>
        <Col xs={24} md={10}>
          <Search
            style={{marginBottom: 8}}
            placeholder={t('search')}
            onSearch={(search) => {
              fetchQuestions.fetch({}, {search});
            }}
          />
        </Col>
      </Row>
      {fetchQuestions.isFetching || fetchVisitQuestions.isFetching ? (
        <Spin size="small" />
      ) : (
        <Row>
          <Tree
            showLine={{
              showLeafIcon: false
            }}
            disabled
            showIcon={false}
            checkable
            defaultCheckedKeys={TreeNodesId()}
            onCheck={ChangeTree}
            treeData={CustomSelectData(fetchQuestions?.data)}
          />
        </Row>
      )}
    </Card>
  );
};

export default QuestionInfo;
