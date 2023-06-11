import qs from 'qs';
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  memo,
  ForwardRefRenderFunction,
  RefObject,
  ForwardedRef
} from 'react';
import {SearchOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Table, Button, Empty, InputNumber, Typography, Space} from 'antd';
import {usePaginate} from 'hooks';
import {useHistory, useLocation} from 'react-router-dom';
import {queryStringToObject} from 'utils';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import merge from 'lodash/merge';
import concat from 'lodash/concat';
import isFunction from 'lodash/isFunction';

interface refProps {
  refresh: () => void;
}

interface TableProps {
  fetch: string;
  dataName: Array<string | number | undefined | null> | string;
  columns: Array<object>;
  hasIndexColumn?: boolean;
  expandable?: object;
  search?: object;
  params?: object;
  query?: object;
  path?: string | string[];
  isRowSelection?: boolean;
  onChange?: (selectedRows: any[]) => void;
  ref?: RefObject<refProps>;
  refreshTable?: boolean;
  rowClassName?: (record: any, index: any) => string;
  showTableSizeChange?: boolean;
}

const {Text} = Typography;

const CustomTable: ForwardRefRenderFunction<refProps, TableProps> = (
  {
    fetch,
    dataName,
    columns,
    hasIndexColumn,
    search,
    query,
    params,
    rowClassName,
    expandable,
    path = 'items',
    isRowSelection,
    onChange,
    showTableSizeChange = false
  },
  forwardedRef: ForwardedRef<refProps>
) => {
  const history = useHistory();
  const location = useLocation();
  const {t} = useTranslation('table');

  const queryObject = queryStringToObject(location.search);

  const [searchPage, setSearchPage] = useState<number>(queryObject?.page ?? 1);

  const paginateData = usePaginate({
    url: fetch,
    name: dataName,
    page: queryObject?.page,
    query,
    search: merge(queryObject, search),
    params,
    enabled: true
  });

  useImperativeHandle(forwardedRef, () => ({
    refresh() {
      paginateData.refetch();
    }
  }));

  const onChangePage = (page: any, per_page?: any) => {
    history.push({
      search: qs.stringify({...queryObject, page, per_page})
    });
  };

  const goToOnChange = (page: any) => setSearchPage(page);
  const itemRender = (page: any, type: any, originalElement: any) =>
    type === 'prev' ? (
      <Button type="text">{t('previous')}</Button>
    ) : type === 'next' ? (
      <Button type="text">{t('next')}</Button>
    ) : (
      originalElement
    );
  const locale = {
    emptyText: (
      <span>
        <Empty description={<span>{t('empty')}</span>} />
      </span>
    )
  };

  return (
    <>
      <Table
        dataSource={isArray(get(paginateData?.data, path)) ? get(paginateData?.data, path) : []}
        columns={
          hasIndexColumn
            ? concat(
                {
                  title: '#',
                  dataIndex: 'number',
                  key: 'number',
                  align: 'center',
                  responsive: ['md'],
                  render: (text: number, record: any, index: number) =>
                    (paginateData?.meta?.current_page - 1) * paginateData?.meta?.per_page + index + 1
                },
                columns
              )
            : columns
        }
        locale={locale}
        loading={paginateData?.isFetching}
        expandable={expandable}
        rowKey="id"
        rowClassName={rowClassName}
        rowSelection={
          isRowSelection
            ? {
                fixed: true,
                onChange: (selectedRowKeys, selectedRows) => {
                  if (isFunction(onChange)) onChange(selectedRows);
                }
              }
            : undefined
        }
        pagination={
          paginateData?.meta?.last_page > 1 && {
            total: paginateData?.meta?.total,
            itemRender,
            onChange: onChangePage,
            current: paginateData?.meta?.current_page,
            defaultPageSize: paginateData?.meta?.per_page,
            pageSize: paginateData?.meta?.per_page,
            pageSizeOptions: ['10', '15', '20', '25', '50', '100'],
            showSizeChanger: showTableSizeChange,
            showQuickJumper: false,
            showTotal: (total, range) => (
              <Text className="text-md">{t('showTotal', {from: get(range, 0), to: get(range, 1), total})}</Text>
            ),
            responsive: true
          }
        }
      />
      {get(paginateData, path)?.length > 0 && paginateData?.meta?.last_page > 1 && (
        <Space className="flex-center">
          <Text className="text-md">{t('page')}</Text>
          <InputNumber max={paginateData?.meta?.last_page} value={searchPage} onChange={goToOnChange} />
          <Button
            className="d-text-none md:d-text-unset"
            icon={<SearchOutlined className="text-md text-grayDarker" />}
            onClick={() => onChangePage(searchPage)}>
            {t('search')}
          </Button>
        </Space>
      )}
    </>
  );
};

export default memo(forwardRef(CustomTable));
