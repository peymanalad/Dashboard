import React, {useState, useEffect, ReactNode, FC, ChangeEvent, useRef, useCallback} from 'react';
import {Button, Checkbox, Col, Form, Input, List, Modal, Row, Space, Spin, Typography} from 'antd';
import {useInfinite, usePost} from 'hooks';
import {ArrowLeftOutlined, SearchOutlined} from '@ant-design/icons';
import ScrollArea from 'react-scrollbar';
import {DrillDownIsParent, itemDrillDownMenu} from 'components/select/DrillDownSelectPaginate';
import remove from 'lodash/remove';
import isEmpty from 'lodash/isEmpty';
import someLodash from 'lodash/some';
import mapLodash from 'lodash/map';
import get from 'lodash/get';
import entries from 'lodash/entries';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import merge from 'lodash/merge';
import {renderLabel} from 'utils';
import {trim} from 'lodash';

export interface menuProps {
  moreActionPreTitle?: string;
  moreActionKeyLabel?: string;
  moreActionKeyValue?: string;
  moreActionUrl?: string;
  moreActionUrlName?: string;
  moreActionUrlPost?: string;
  moreActionSelectKey?: string;
  moreActionUseGeneralApi?: boolean;
  moreActionIcon?: ReactNode;
  moreActionShowSearch?: boolean;
  moreActionIsGeneral?: boolean;
  searchKey?: string | any;
  keyLabel: string;
  keyBottomLabel?: string;
  keyValue: string;
  keyImage?: string;
  notSelectParent?: boolean;
  notSelectChild?: boolean;
  scrollHeight?: string;
  mode: 'multiple' | 'single';
  selectedItems: itemDrillDownMenu | itemDrillDownMenu[] | null;
  url: string;
  urlName: string;
  isGeneral?: boolean;
  showSearch: boolean;
  dropDownWith?: number | boolean;
  optionClassName?: string;
  defaultValues?: any;
  value?: any;
  onChangeSelectedItems?: (selectedItems: itemDrillDownMenu | itemDrillDownMenu[] | null, keys: any | any[]) => void;
  allowClear?: boolean;
  params?: any;
  dataTag?: Array<object>;
  tagColor?: string;
  disabled?: boolean;
}

const DrillDownMenu: FC<menuProps> = ({
  keyLabel,
  keyValue,
  keyBottomLabel,
  scrollHeight,
  notSelectParent,
  notSelectChild,
  selectedItems,
  mode,
  url,
  urlName,
  isGeneral = false,
  moreActionIcon,
  moreActionUrl,
  moreActionUrlName,
  moreActionSelectKey,
  moreActionUrlPost,
  moreActionKeyValue,
  moreActionKeyLabel,
  moreActionPreTitle,
  moreActionIsGeneral = false,
  showSearch,
  moreActionShowSearch,
  searchKey = 'search',
  onChangeSelectedItems,
  params
}) => {
  const {Text} = Typography;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [depth, setDepth] = useState<itemDrillDownMenu[]>([]);
  const [moreActionSelect, moreActionSetSelect] = useState<any | undefined>(undefined);

  const [form] = Form.useForm();

  const fetchDrillDown = useInfinite({
    url,
    name: [urlName, depth[depth?.length - 1]?.id],
    isGeneral,
    query: merge(
      {
        parent_id: depth?.length ? depth[depth?.length - 1]?.id : undefined
      },
      params
    )
  });

  const moreActionFetch = useInfinite({
    url: moreActionUrl || '',
    name: [moreActionUrlName, moreActionSelect?.id],
    isGeneral: moreActionIsGeneral,
    query: merge(
      {
        disease_id: moreActionSelect?.id
      },
      params
    )
  });
  const submitMoreAction = usePost({
    url: moreActionUrlPost || '',
    method: 'POST',
    onSuccess: () => {
      setShowModal(false);
    }
  });

  useEffect(() => {
    if (!fetchDrillDown.isFetched) fetchDrillDown.fetch();
  }, [depth]);

  useEffect(() => {
    if (moreActionSelect) {
      moreActionFetch.refetch();
      setShowModal(true);
    }
  }, [moreActionSelect]);

  const debouncedSearch = useRef(
    debounce(async (str) => {
      fetchDrillDown.remove();
      fetchDrillDown.fetch({}, {search: trim(str)});
    }, 1500)
  ).current;
  const moreActionDebounced = useRef(
    debounce(async (str) => {
      moreActionFetch.remove();
      moreActionFetch.fetch({}, {search: trim(str)});
    }, 1500)
  ).current;

  const onSearch = useCallback((e: any) => {
    debouncedSearch(e.target.value);
  }, []);

  const moreActionOnSearch = useCallback((e: any) => {
    moreActionDebounced(e.target.value);
  }, []);

  const onscroll = (e: any) => {
    if (
      e.realHeight === e.containerHeight + e.topPosition &&
      !fetchDrillDown.isFetching &&
      fetchDrillDown.data &&
      fetchDrillDown.hasNextPage
    )
      fetchDrillDown.fetchNextPage();
  };

  const moreActionOnscroll = (e: any) => {
    if (
      e.realHeight === e.containerHeight + e.topPosition &&
      !moreActionFetch.isFetching &&
      moreActionFetch.data &&
      moreActionFetch.hasNextPage
    )
      moreActionFetch.fetchNextPage();
  };

  const onBackDepth = () => {
    const newDepth = [...depth];
    newDepth.pop();
    setDepth(newDepth);
  };

  const onChangeItem = (item: itemDrillDownMenu, isChecked: boolean) => {
    if (onChangeSelectedItems && mode === 'multiple') {
      const newSelectedItems: itemDrillDownMenu[] =
        isEmpty(selectedItems) || !isArray(selectedItems) ? [] : [...selectedItems];
      if (isChecked) {
        newSelectedItems.push(item);
        onChangeSelectedItems(newSelectedItems, mapLodash(newSelectedItems, keyValue));
      } else {
        remove(newSelectedItems, {id: item?.id});
        onChangeSelectedItems(newSelectedItems, mapLodash(newSelectedItems, keyValue));
      }
    } else if (onChangeSelectedItems) {
      if (isChecked) {
        onChangeSelectedItems(item, item?.id);
      } else {
        onChangeSelectedItems(null, null);
      }
    }
  };

  const onFinish = (values: any) => {
    const questions = mapLodash(entries(values), ([key, values]) => values && key);
    submitMoreAction.post({questions, disease_id: moreActionSelect?.id});
  };

  return (
    <>
      <Modal
        title={
          moreActionPreTitle
            ? `${moreActionPreTitle} ${renderLabel(moreActionSelect, keyLabel)}`
            : `${moreActionPreTitle} ${renderLabel(moreActionSelect, keyLabel)}`
        }
        visible={showModal}
        footer={moreActionUrlPost ? undefined : null}
        confirmLoading={submitMoreAction.isLoading}
        onOk={(e) => {
          form.submit();
        }}
        onCancel={() => {
          setShowModal(false);
        }}>
        {/*@ts-ignore*/}
        <ScrollArea
          contentClassName="mr-5"
          speed={1}
          onScroll={moreActionOnscroll}
          horizontal={false}
          style={{height: '50vh'}}>
          {moreActionShowSearch && <Input addonAfter={<SearchOutlined />} onChange={moreActionOnSearch} />}
          {moreActionFetch.isFetching && !moreActionFetch.hasNextPage && (
            <Spin size="small" className="flex-center my-2" />
          )}
          <Form
            layout="vertical"
            requiredMark={false}
            form={form}
            className=" w-full"
            name="AccountInfo"
            onFinish={onFinish}>
            <List
              dataSource={isArray(moreActionFetch.data) ? moreActionFetch.data : []}
              renderItem={(item: any) => (
                <List.Item className="flex-center">
                  {moreActionUrlPost && moreActionSelectKey ? (
                    <Form.Item
                      name={renderLabel(item, moreActionKeyValue)}
                      valuePropName="checked"
                      className="m-0"
                      initialValue={get(item, moreActionSelectKey)}>
                      <Checkbox>{renderLabel(item, moreActionKeyLabel)}</Checkbox>
                    </Form.Item>
                  ) : (
                    renderLabel(item, moreActionKeyLabel)
                  )}
                </List.Item>
              )}
            />
          </Form>
          {moreActionFetch.isFetchingNextPage && <Spin size="small" className="flex-center my-2" />}
        </ScrollArea>
      </Modal>
      {showSearch && <Input className="mb-1" addonAfter={<SearchOutlined />} onChange={onSearch} />}
      {/*@ts-ignore*/}
      <ScrollArea
        contentClassName="mr-5"
        speed={1}
        onScroll={onscroll}
        horizontal={false}
        style={{height: scrollHeight}}>
        {!isEmpty(depth) ? (
          <Row gutter={24} className="my-2">
            <Col span={24} className="flex flex-row-reverse align-center cursor-pointer" onClick={onBackDepth}>
              <Space align="center">
                <Text style={{color: '#1890ff'}}>{depth[depth?.length - 1]?.name}</Text>
                <ArrowLeftOutlined style={{color: '#1890ff'}} />
              </Space>
            </Col>
          </Row>
        ) : null}
        {fetchDrillDown.isFetching && !fetchDrillDown.isFetchingNextPage && (
          <Spin size="small" className="flex-center my-2" />
        )}
        <List
          dataSource={isArray(fetchDrillDown.data) ? fetchDrillDown.data : []}
          renderItem={(item: itemDrillDownMenu) => (
            <List.Item className="flex flex-row align-center">
              {(item?.is_parent === DrillDownIsParent?.parent && notSelectParent) ||
              (item?.is_parent === DrillDownIsParent.notParent && notSelectChild) ? (
                <Text>{renderLabel(item, keyLabel)}</Text>
              ) : (
                <Checkbox
                  checked={
                    isArray(selectedItems) ? someLodash(selectedItems, {id: item?.id}) : selectedItems?.id === item?.id
                  }
                  onChange={(e) => onChangeItem(item, e.target.checked)}>
                  <Space direction="horizontal" size="small" align="center">
                    <Text>{renderLabel(item, keyLabel)}</Text>
                    {keyBottomLabel && (
                      <Text type="secondary" className="text-xs">
                        {renderLabel(item, keyBottomLabel)}
                      </Text>
                    )}
                  </Space>
                </Checkbox>
              )}
              <Col>
                {moreActionUrl && moreActionIcon && (
                  <Button
                    type="text"
                    onClick={() => {
                      moreActionSetSelect(item);
                    }}
                    icon={moreActionIcon}
                  />
                )}
                {item?.is_parent ? (
                  <Button
                    type="text"
                    onClick={() => {
                      setDepth((prevState) => (prevState?.length ? [...prevState, item] : [item]));
                    }}
                    icon={<ArrowLeftOutlined style={{color: 'gray'}} />}
                  />
                ) : null}
              </Col>
            </List.Item>
          )}
        />
        {fetchDrillDown.isFetchingNextPage && <Spin size="small" className="flex-center my-2" />}
      </ScrollArea>
    </>
  );
};

export default DrillDownMenu;
