import React, {CSSProperties, FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Row, Col, Button, InputNumber, Input, Space, Form} from 'antd';
import {PlusOutlined, DeleteOutlined, DragOutlined} from '@ant-design/icons';
import {optionsTypeProps, alertTypeProps} from 'types/question';
import {DragDropContext, Droppable, Draggable, DraggingStyle, NotDraggingStyle} from 'react-beautiful-dnd';
import reverse from 'lodash/reverse';
import isEmpty from 'lodash/isEmpty';

export interface props {
  options: optionsTypeProps[];
  alerts: alertTypeProps[];
}

const SchemeCare: FC<props> = ({options, alerts}) => {
  const {t} = useTranslation('question');

  const getOptions = (): optionsTypeProps[] => {
    if (options && options?.length > 0) {
      let newOptions: optionsTypeProps[] = options;
      newOptions = newOptions?.map((option: optionsTypeProps, index: number) => {
        const maxId =
          options.reduce(
            (max: number, option: optionsTypeProps) => (option?.id > max ? option?.id : max),
            options[0]?.id
          ) || index;
        return {
          id: option?.id || maxId + 1,
          name: option?.name || '',
          value: Number(option?.value) || 0,
          alert: alerts?.filter((alert: alertTypeProps) => alert?.id === option?.id)[0]?.text
        };
      });
      return newOptions;
    }
    return [];
  };

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

  return (
    <Row className="w-full overflow-x-auto md:overflow-visible">
      <Row className="w-full min-w-600px">
        <Row className="flex-center w-full flex-col mb-2">
          <Row className="w-full p-3 bg-snow border-1 border-gainsBoro border-solid">
            <Col span={8} className="text-center">
              {t('name')}
            </Col>
            <Col span={4} className="text-center">
              {t('value')}
            </Col>
            <Col span={10} className="text-center">
              {t('alert')}
            </Col>
            <Col span={2} className="text-center">
              {t('actions')}
            </Col>
          </Row>
          <Form.List
            name="options"
            rules={[
              {
                validator: (rule, value) => {
                  if (!isEmpty(value)) return Promise.resolve();
                  return Promise.reject(t('messages.required'));
                }
              }
            ]}
            initialValue={getOptions()}>
            {(fields, {add, remove, move}, {errors}) => (
              <DragDropContext
                onDragEnd={(result) => {
                  if (result.destination?.index !== undefined) move(result.source.index, result.destination?.index);
                }}>
                <Row gutter={[16, 8]} className="w-full p-3 border-1 border-gainsBoro border-solid">
                  <Col className="w-full">
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      {t('add_option')}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Form.ErrorList errors={errors} />
                </Row>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={getListStyle(snapshot.isDraggingOver)}>
                      {reverse(fields)?.map((field) => (
                        <Draggable
                          key={field?.name.toString()}
                          draggableId={field?.name.toString()}
                          index={field?.name}>
                          {(provided, snapshot) => (
                            <Row
                              className="w-full p-3 border-1 border-gainsBoro border-solid"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                              <Form.Item noStyle {...field} shouldUpdate>
                                <Col span={8} className="pl-5">
                                  <Form.Item noStyle name={[field.name, 'id']} fieldKey={[field?.name, 'id']} />
                                  <Form.Item
                                    rules={[{required: true, message: t('messages.required')}]}
                                    name={[field.name, 'name']}
                                    className="no-validate-message"
                                    fieldKey={[field?.name, 'name']}>
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={4} className="pl-5">
                                  <Form.Item
                                    rules={[{required: true, message: t('messages.required')}]}
                                    name={[field.name, 'value']}
                                    className="no-validate-message"
                                    fieldKey={[field?.name, 'value']}>
                                    <InputNumber type="number" className="w-full" />
                                  </Form.Item>
                                </Col>
                                <Col span={10} className="pl-5">
                                  <Form.Item
                                    name={[field.name, 'alert']}
                                    className="no-validate-message"
                                    fieldKey={[field?.name, 'alert']}>
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={2}>
                                  <Space className="justify-between flex">
                                    <Button
                                      danger
                                      type="primary"
                                      icon={<DeleteOutlined />}
                                      onClick={() => remove(field.name)}
                                    />
                                    <Button type="text" style={{color: '#5e5e5e'}} icon={<DragOutlined size={20} />} />
                                  </Space>
                                </Col>
                              </Form.Item>
                            </Row>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </Form.List>
        </Row>
      </Row>
    </Row>
  );
};

export default SchemeCare;
