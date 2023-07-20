import React, {useRef, useState} from 'react';
import {Row, Col, Card, Space, Button} from 'antd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider, useDrag, useDrop, DropTargetMonitor} from 'react-dnd';
import {SaveOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';
import {useFetch} from 'hooks';
import {PostGroupProps} from 'types/news';

const {Meta} = Card;

const SquareCard: React.FC<{
  initialNews: PostGroupProps[];
  news: PostGroupProps;
  setNews: React.Dispatch<React.SetStateAction<PostGroupProps[]>>;
}> = ({initialNews, news, setNews}) => {
  const [{isDragging}, drag] = useDrag({
    type: 'news',
    item: {id: news.id, ordering: news.ordering},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'news',
    hover: (item: PostGroupProps, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) return;
      const draggedOrder = item.ordering;
      const targetOrder = news.ordering;

      if (draggedOrder === targetOrder) return;

      const updatedSquares = sortBy(
        initialNews.map((sq) => {
          if (sq.ordering === draggedOrder) return {...sq, ordering: targetOrder};
          if (sq.ordering === targetOrder) return {...sq, ordering: draggedOrder};
          return sq;
        }),
        'ordering'
      );

      setNews(updatedSquares);
    }
  });

  return (
    <div ref={(node) => drag(drop(node))} className="h-full" style={{opacity: isDragging ? 0.5 : 1}}>
      <Card
        rootClassName="h-full"
        bodyStyle={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Meta title={news.postGroupDescription || '-'} />
      </Card>
    </div>
  );
};

const generateRow = (initialNews: PostGroupProps[], chunkNews: PostGroupProps[], setNews: any, index: number) => {
  switch (index % 4) {
    case 2:
    case 0:
      return (
        <Row gutter={[16, 16]} className={index % 4 === 2 ? 'mb-1' : 'flex-row-reverse mb-1'}>
          <Col span={8}>
            <Row gutter={[16, 16]}>
              <Col span={24} className="h-full">
                <SquareCard initialNews={initialNews} news={chunkNews[1]} setNews={setNews} />
              </Col>
              <Col span={24}>
                <SquareCard initialNews={initialNews} news={chunkNews[2]} setNews={setNews} />
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            <SquareCard initialNews={initialNews} news={chunkNews[0]} setNews={setNews} />
          </Col>
        </Row>
      );
    case 1:
    case 3:
      return (
        <Row gutter={[16, 16]} className="mb-1">
          {chunkNews?.map((chunckNew: PostGroupProps) => (
            <Col span={8}>
              <SquareCard initialNews={initialNews} news={chunckNew} setNews={setNews} />
            </Col>
          ))}
        </Row>
      );
    default:
      return null;
  }
};

const NewsGroupOrder: React.FC = () => {
  const {t} = useTranslation('news');
  const initialNews = useRef<PostGroupProps[]>([]);
  const [news, setNews] = useState<PostGroupProps[]>([]);

  const fetchNewsGroup = useFetch({
    name: 'postGroups',
    url: '/services/app/PostGroups/GetAll',
    enabled: true,
    onSuccess(data) {
      initialNews.current = data?.data?.items?.map((postGroup: any, index: number) => ({
        ...postGroup?.postGroup,
        ordering: postGroup?.postGroup?.ordering || index + 1
      }));
      setNews(initialNews.current);
    }
  });

  return (
    <Card
      title={t('news_groups')}
      loading={fetchNewsGroup?.isFetching}
      bodyStyle={{direction: 'ltr'}}
      extra={
        <Space size="small">
          <Button
            className="w-full sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            // loading={storeNewsGroup.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Space>
      }>
      <DndProvider backend={HTML5Backend}>
        {chunk(news, 3)?.map((chunkNews: PostGroupProps[], index: number) =>
          generateRow(initialNews.current, chunkNews, setNews, index)
        )}
      </DndProvider>
    </Card>
  );
};

export default NewsGroupOrder;
