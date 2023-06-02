import React from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Row, Col} from 'antd';
import {QuestionOutlined} from '@ant-design/icons';
import {DrillDownMenu} from 'components';

const ShowTree = () => {
  const {t} = useTranslation('question');

  return (
    <Card title={t('tree_questions')} bordered={false} className="w-full">
      <Row gutter={[16, 8]} justify="center">
        <Col xs={24} md={20} lg={12}>
          <DrillDownMenu
            moreActionPreTitle={t('questions')}
            mode="multiple"
            url="diseases/children"
            urlName="diseasesChildren"
            isGeneral
            moreActionUrl="diseases/questions"
            moreActionUrlName="diseasesQuestions"
            moreActionIsGeneral
            keyLabel="name"
            keyValue="id"
            notSelectParent
            notSelectChild
            selectedItems={null}
            moreActionIcon={<QuestionOutlined style={{color: 'blue'}} />}
            showSearch
            scrollHeight="55vh"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ShowTree;
