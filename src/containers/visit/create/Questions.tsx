import React, {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {Card, Button, Tree, Row, Form} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {CustomSelectData} from 'utils';
import map from 'lodash/map';
import forEach from 'lodash/forEach';

interface Props {
  id?: string;
}

const QuestionInfo: FC<Props> = ({id}) => {
  const {t} = useTranslation('visit');
  const [form] = Form.useForm();
  const [visitQuestions, setVisitQuestions] = useState<any>([]);

  const fetchVisitQuestions = useFetch({
    name: ['visit', 'question', id],
    url: 'visits/{id}/questions',
    params: {id},
    enabled: true
  });

  const updateQuestion = usePost({
    url: 'visits/{id}/questions',
    method: 'POST',
    removeQueries: [['visit', 'question', id]],
    form
  });

  const ChangeTree = (checkedKeys: any, info: any) => {
    const newNodes: any[] = [];
    map(info?.checkedNodes, (node: any) => {
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
    forEach(fetchVisitQuestions.data, (item: any) => {
      forEach(item.questions, (question: any) => {
        question.is_selected && newCheckedData.push(question.id);
      });
    });
    return newCheckedData;
  };

  const onSave = () => {
    const formData = new FormData();
    if (visitQuestions?.length !== 0) {
      forEach(visitQuestions, (question: any, index: number) => {
        formData.append(`questions_id[${index}]`, `${question?.id}`);
      });
    } else formData.append('questions_id', '');

    updateQuestion.post(formData, {}, {id});
  };

  return (
    <Card
      title={t(id ? 'edit_file.title' : 'create.title')}
      bordered={false}
      className="w-full"
      loading={fetchVisitQuestions.isFetching || !fetchVisitQuestions.data}>
      <Row>
        <Row>
          <Tree
            showLine={{
              showLeafIcon: false
            }}
            showIcon={false}
            checkable
            defaultCheckedKeys={TreeNodesId()}
            onCheck={ChangeTree}
            treeData={CustomSelectData(fetchVisitQuestions?.data, 'name')}
          />
        </Row>
        <Row gutter={[16, 8]} className="w-full my-5">
          <Button
            className="w-full sm:w-unset mr-auto my-4"
            type="primary"
            htmlType="submit"
            loading={updateQuestion.isLoading}
            onClick={onSave}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Row>
      </Row>
    </Card>
  );
};

export default QuestionInfo;
