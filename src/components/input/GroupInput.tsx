import React, {CSSProperties, FC} from 'react';
import {Button, Col, Form, Row} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import map from 'lodash/map';
import get from 'lodash/get';
import {itemElementProps} from 'types/setting';
import {useTranslation} from 'react-i18next';
import {FormBuilder} from 'components';
import {DragDropContext, Droppable, Draggable, DraggingStyle, NotDraggingStyle} from 'react-beautiful-dnd';
import isFunction from 'lodash/isFunction';
import toString from 'lodash/toString';

export interface props {
  elements?: itemElementProps[];
  onChange?(source: number, destination?: number): void;
  className?: string;
  name: string | string[];
  title?: string;
  form?: any;
  addButtonTitle?: string;
  breakpoint?: string;
  showLabel?: boolean;
  actionSpan?: number;
  initialValues: any;
}
const GroupInput: FC<props> = ({
  name,
  elements,
  onChange,
  form,
  addButtonTitle,
  initialValues,
  className,
  showLabel,
  actionSpan = 2,
  breakpoint = '500px'
}) => {
  const {t} = useTranslation('general');

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

  const createLabelItem = (elementDetail: any) => (
    <Col className="text-center" style={{flex: `0 0 ${elementDetail?.size * 100}%`}}>
      {elementDetail.title}
    </Col>
  );

  return (
    <Col span={24} className={`w-full overflow-visible ${className}`}>
      <Row style={{minWidth: breakpoint}}>
        {!showLabel && (
          <Row gutter={[16, 8]} className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid m-0">
            <Col span={24 - actionSpan}>
              <Row className="m-0 d-flex align-center">{map(elements, (element: any) => createLabelItem(element))}</Row>
            </Col>
            <Col span={actionSpan} className="text-center">
              {t('action')}
            </Col>
          </Row>
        )}
        <Form.List name={name} initialValue={get(initialValues, name)}>
          {(fields, {add, remove}) => (
            <DragDropContext
              onDragEnd={(result) => {
                if (isFunction(onChange)) onChange(result.source.index, result?.destination?.index);
              }}>
              <Row gutter={[16, 8]} className="w-full p-3 border-1 border-gainsBoro border-solid m-0">
                <Col className="w-full">
                  <Button type="dashed" onClick={() => add({}, 0)} block icon={<PlusOutlined />}>
                    {addButtonTitle || t('add')}
                  </Button>
                </Col>
              </Row>
              <Droppable droppableId="GroupInput">
                {(provided, snapshot) => (
                  <Row
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {map(fields, (field, index: number) => (
                      <Draggable key={index} draggableId={toString(index)} index={index}>
                        {(provided, snapshot) => (
                          <Row
                            gutter={[16, 8]}
                            key={field.key}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            className="w-full p-3 border-1 border-gainsBoro border-solid m-0 align-center border-top-0">
                            <Form.Item noStyle {...field}>
                              <Col span={24 - actionSpan}>
                                <Row gutter={[16, 8]} className="m-0 d-flex align-center">
                                  {map(elements, (element: any) => (
                                    <FormBuilder
                                      name={[field.name]}
                                      index={toString(field.name)}
                                      listName={name}
                                      form={form}
                                      data={element}
                                      initialValues={initialValues}
                                      showLabel={showLabel}
                                      className="w-full no-validate-message flex-center"
                                    />
                                  ))}
                                </Row>
                              </Col>
                              <Col span={actionSpan} className="flex justify-center">
                                <Button
                                  danger
                                  type="primary"
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(field.name)}
                                />
                              </Col>
                            </Form.Item>
                          </Row>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Row>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Form.List>
      </Row>
    </Col>
  );
};

export default GroupInput;
