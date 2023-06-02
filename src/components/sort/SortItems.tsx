import React, {CSSProperties} from 'react';
import {Button, Card, Col, Row, Typography} from 'antd';
import {DragOutlined, SaveOutlined} from '@ant-design/icons';
import {useFetch, usePost} from 'hooks';
import {DragDropContext, Draggable, DraggingStyle, Droppable, NotDraggingStyle} from 'react-beautiful-dnd';
import map from 'lodash/map';
import toString from 'lodash/toString';
import {useQueryClient} from 'react-query';
import cloneWith from 'lodash/cloneWith';
import get from 'lodash/get';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import {reorderList} from 'utils';
import {sortItem} from 'types/general';

export interface Props {
  showData: sortItem[];
  actionSpan?: number;
  titleKey?: string;
  name: string | string[];
  fetchUrl: string;
  sendUrl: string;
  query?: object;
  sendKey: string;
  t: (key: string | string[], options?: object) => string;
}

function SortItems({name, query, fetchUrl, sendUrl, sendKey, showData, titleKey = 'title', actionSpan = 4, t}: Props) {
  const {Text} = Typography;
  const queryClient = useQueryClient();

  const fetchItems = useFetch({
    name,
    url: fetchUrl,
    query,
    enabled: true
  });

  const storeSpecification = usePost({
    url: sendUrl,
    method: 'POST',
    removeQueries: [name]
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : '',
    width: '100%',
    marginBottom: isDraggingOver ? '58px' : 0
  });

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ): CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '',
    // styles we need to apply on draggables
    ...draggableStyle
  });

  const send = () => {
    storeSpecification.post({
      [sendKey]: map(fetchItems?.data, (item: any) => item?.id)
    });
  };

  return (
    <Card
      title={t(titleKey)}
      loading={fetchItems?.isFetching || !fetchItems?.data}
      extra={
        fetchItems?.data?.length > 15 && (
          <Button type="primary" onClick={send} loading={storeSpecification.isLoading} icon={<SaveOutlined />}>
            {t('save')}
          </Button>
        )
      }>
      <Row className="flex-center w-full flex-col mb-2">
        <Row className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
          {map(showData, (data: sortItem, index: number) => (
            <Col key={index} span={data.span} className="text-center">
              <Text strong className="text-center d-block">
                {t(data.key)}
              </Text>
            </Col>
          ))}
          <Col span={actionSpan} className="text-center">
            <Text strong className="text-center d-block">
              {t('actions')}
            </Text>
          </Col>
        </Row>
        <Row className="flex-center w-full flex-col mb-2">
          <DragDropContext
            onDragEnd={(result) => {
              queryClient.setQueryData(name, (items: any) =>
                cloneWith(items, (newItems: any) => {
                  set(
                    newItems,
                    'data',
                    reorderList(get(newItems, 'data'), result.source.index, result?.destination?.index)
                  );
                  return newItems;
                })
              );
            }}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
                  {map(fetchItems?.data, (item: any, index: number) => (
                    <Draggable key={index} draggableId={toString(index)} index={index}>
                      {(provided, snapshot) => (
                        <Row
                          className="w-full p-3 border-1 border-gainsBoro border-solid"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          {map(showData, (data: sortItem, index: number) => (
                            <Col key={index} span={data.span} className="flex-center">
                              <Text className="text-center d-block">
                                {isFunction(data?.render) ? data?.render(get(item, data.key)) : get(item, data.key)}
                              </Text>
                            </Col>
                          ))}
                          <Col span={actionSpan} className="flex justify-center items-center">
                            <Button type="text" style={{color: '#5e5e5e'}} icon={<DragOutlined size={20} />} />
                          </Col>
                        </Row>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Row>
      </Row>
      <Row gutter={[16, 8]} className="w-full flex justify-end align-center my-5">
        <Button type="primary" onClick={send} loading={storeSpecification.isLoading} icon={<SaveOutlined />}>
          {t('save')}
        </Button>
      </Row>
    </Card>
  );
}

export default SortItems;
