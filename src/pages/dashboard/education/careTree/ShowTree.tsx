import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {Spin, Card, Row} from 'antd';
import {LineGraph, NodeGraph} from 'components';
// @ts-ignore
import Graph from 'react-graph-network';

const ShowTree = () => {
  const {t} = useTranslation('care');

  const fetchDiseaseGraph = useFetch({
    url: 'diseases/graph',
    name: ['diseases', 'graph'],
    enabled: true
  });

  return (
    <Card
      title={t('tree')}
      bordered={false}
      bodyStyle={{height: '80vh'}}
      className="w-full"
      loading={fetchDiseaseGraph.isFetching || !fetchDiseaseGraph?.data}>
      <Row className="h-full w-full">
        <Graph
          data={fetchDiseaseGraph?.data}
          nodeDistance={10}
          NodeComponent={NodeGraph}
          LineComponent={LineGraph}
          zoomDepth={6}
          hoverOpacity={0.3}
          enableDrag
          pullIn={false}
        />
      </Row>
    </Card>
  );
};

export default ShowTree;
