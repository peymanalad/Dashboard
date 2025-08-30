import React, {useState} from 'react';
import GridLayout, {Layout} from 'react-grid-layout';
import 'react-resizable/css/styles.css';

import {useTranslation} from 'react-i18next';
import {Button, Card, Space} from 'antd';
import {FilterOutlined} from '@ant-design/icons';

const {Meta} = Card;
const GridLayoutAny = GridLayout as any;
const initialSquares: Layout[] = [
  {i: '1', x: 0, y: 0, w: 2, h: 2},
  {i: '2', x: 2, y: 0, w: 1, h: 1},
  {i: '3', x: 3, y: 0, w: 1, h: 1},
  {i: '4', x: 0, y: 2, w: 1, h: 1},
  {i: '5', x: 1, y: 2, w: 1, h: 1},
  {i: '6', x: 2, y: 2, w: 1, h: 1},
  {i: '7', x: 0, y: 3, w: 1, h: 1},
  {i: '8', x: 1, y: 3, w: 1, h: 1},
  {i: '9', x: 2, y: 3, w: 1, h: 1},
  {i: '10', x: 0, y: 3, w: 1, h: 1},
  {i: '11', x: 0, y: 4, w: 1, h: 1},
  {i: '12', x: 1, y: 3, w: 2, h: 2}
];

const NewsGroupOrder: React.FC = () => {
  const {t} = useTranslation('news');
  const [layout, setLayout] = useState<Layout[]>(initialSquares);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout.map((item, index) => ({...item, i: (index + 1).toString()})));
  };

  return (
    <Card
      title={t('news_groups')}
      extra={
        <Space size="small">
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <GridLayoutAny
        className="ltr"
        layout={layout}
        cols={3}
        isDroppable={false}
        rowHeight={100}
        width={1000}
        onLayoutChange={onLayoutChange}>
        {layout.map((item) => (
          <Card key={item.i}>
            <Meta title={`Square ${item.i}`} />
          </Card>
        ))}
      </GridLayoutAny>
    </Card>
  );
};

export default NewsGroupOrder;
