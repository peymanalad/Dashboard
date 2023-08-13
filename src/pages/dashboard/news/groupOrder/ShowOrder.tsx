import React, {useRef, useState, type FC, type Dispatch, type SetStateAction, CSSProperties} from 'react';
import {Row, Col, Card, Space, Button} from 'antd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider, useDrag, useDrop, DropTargetMonitor} from 'react-dnd';
import IPhone8FrameView from 'components/view/Iphone8FrameView';
import {SaveOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';
import {useFetch, usePost} from 'hooks';
import {generateUniqueColorCodeById} from 'utils';
import orderBy from 'lodash/orderBy';
import type {PostGroupProps} from 'types/news';

const {Meta} = Card;

const SquareCard: FC<{
  initialNews: PostGroupProps[];
  news: PostGroupProps;
  setNews: Dispatch<SetStateAction<PostGroupProps[]>>;
  style?: CSSProperties;
}> = ({initialNews, news, setNews, style}) => {
  const [{isDragging}, drag] = useDrag({
    type: 'news',
    item: {id: news?.id, ordering: news?.ordering},
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'news',
    hover: (item: PostGroupProps, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) return;
      const draggedOrder = item.ordering;
      const targetOrder = news?.ordering;

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
    <div ref={(node) => drag(drop(node))} className="h-full" style={{opacity: isDragging ? 0.5 : 1, ...style}}>
      <Card
        rootClassName="h-full"
        bodyStyle={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: news?.color,
          borderRadius: 8
        }}>
        <Meta title={news?.postGroupDescription || '-'} />
      </Card>
    </div>
  );
};

const generateRow = (initialNews: PostGroupProps[], chunkNews: PostGroupProps[], setNews: any, index: number) => {
  switch (index % 4) {
    case 0:
    case 2:
      return (
        <Row gutter={[5, 5]} className={index % 4 === 2 ? 'mb-1/4' : 'flex-row-reverse mb-1/4'}>
          <Col span={8}>
            <Row gutter={[5, 5]}>
              {chunkNews?.[1] && (
                <Col span={24} className="h-full">
                  <SquareCard initialNews={initialNews} news={chunkNews[1]} setNews={setNews} />
                </Col>
              )}
              {chunkNews?.[2] && (
                <Col span={24}>
                  <SquareCard initialNews={initialNews} news={chunkNews[2]} setNews={setNews} />
                </Col>
              )}
            </Row>
          </Col>
          {chunkNews?.[0] && (
            <Col span={16} style={{height: 140}}>
              <SquareCard initialNews={initialNews} news={chunkNews[0]} setNews={setNews} />
            </Col>
          )}
        </Row>
      );
    case 1:
    case 3:
      return (
        <Row gutter={[5, 5]} className="mb-1/4">
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

const NewsGroupOrder: FC = () => {
  const {t} = useTranslation('news');
  const initialNews = useRef<PostGroupProps[]>([]);
  const [news, setNews] = useState<PostGroupProps[]>([]);

  const fetchNewsGroup = useFetch({
    name: 'postGroups',
    url: '/services/app/PostGroups/GetAll',
    query: {
      MaxResultCount: 50
    },
    enabled: true,
    staleTime: 100,
    onSuccess(data) {
      initialNews.current = orderBy(
        data?.data?.items?.map((postGroup: any, index: number) => ({
          ...postGroup?.postGroup,
          color: generateUniqueColorCodeById(postGroup?.postGroup?.id),
          ordering: postGroup ? postGroup?.postGroup?.ordering || index + 1 : null
        })),
        'ordering'
      );
      setNews(initialNews.current);
    }
  });

  const storePostGroupOrder = usePost({
    url: 'services/app/PostGroups/UpdatePostGroupOrdering',
    method: 'PUT',
    removeQueries: ['postGroups']
  });

  const onSave = () => {
    const orderData: any = {};
    news?.forEach((theNew: PostGroupProps, index: number) => {
      orderData[theNew.id] = index + 1;
    });
    storePostGroupOrder.post(orderData);
  };

  return (
    <Card
      title={t('news_groups_order')}
      loading={fetchNewsGroup?.isFetching}
      bodyStyle={{direction: 'ltr', maxWidth: !fetchNewsGroup?.isFetching ? '450px' : undefined, margin: 'auto'}}
      extra={
        <Space size="small">
          <Button
            className="sm:w-unset mr-auto"
            type="primary"
            htmlType="submit"
            onClick={onSave}
            loading={storePostGroupOrder.isLoading}
            icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        </Space>
      }>
      <IPhone8FrameView>
        <DndProvider backend={HTML5Backend}>
          {chunk(news, 3)?.map((chunkNews: PostGroupProps[], index: number) =>
            generateRow(initialNews.current, chunkNews, setNews, index)
          )}
        </DndProvider>
      </IPhone8FrameView>
    </Card>
  );
};

export default NewsGroupOrder;
