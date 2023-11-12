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
import concat from 'lodash/concat';
import isFunction from 'lodash/isFunction';
import replace from 'lodash/replace';
import SelectOrganization from 'containers/organization/SelectOrganization';

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
  hasOrganization?: boolean;
  enabled?: boolean;
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
    hasOrganization = false,
    enabled = true,
    onChange,
    showTableSizeChange = true
  },
  forwardedRef: ForwardedRef<refProps>
) => {
  const history = useHistory();
  const location = useLocation();
  const {t} = useTranslation('table');

  const queryObject = queryStringToObject(location.search);
  const selectedOrganization = queryObject?.organization;

  const [searchPage, setSearchPage] = useState<number>(queryObject?.page ?? 1);

  const paginateData = usePaginate({
    url: fetch,
    name: hasOrganization ? [dataName, 'organization', selectedOrganization?.id]?.flat(1) : dataName,
    page: queryObject?.page,
    perPage: queryObject?.per_page,
    query: hasOrganization ? {...query, organizationId: selectedOrganization?.id} : query,
    search: {...search, Filter: queryObject?.search, FromDate: queryObject?.FromDate, ToDate: queryObject?.ToDate},
    params,
    enabled: hasOrganization ? !!selectedOrganization?.id && enabled : enabled
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
      {hasOrganization && <SelectOrganization />}
      <Table
        dataSource={
          isArray(path?.length ? get(paginateData?.data, path) : paginateData?.data)
            ? path?.length
              ? get(paginateData?.data, path)
              : paginateData?.data
            : []
        }
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
                    ((+queryObject?.page || 1) - 1) * (+queryObject?.per_page || 10) + index + 1
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
        onChange={(pagination, filters, sorter: any) => {
          paginateData.fetch(undefined, undefined, {
            Sorting: sorter?.order ? `${sorter?.columnKey} ${replace(sorter?.order, 'end', '')}` : undefined
          });
        }}
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
        pagination={{
          total: paginateData?.data?.totalCount,
          itemRender,
          onChange: onChangePage,
          current: +queryObject?.page || 1,
          defaultPageSize: +queryObject?.per_page || 10,
          pageSize: +queryObject?.per_page || 10,
          pageSizeOptions: ['10', '20', '25', '50', '100'],
          showSizeChanger: showTableSizeChange,
          showQuickJumper: false,
          showTotal: (total, range) => (
            <Text className="text-md">{t('showTotal', {from: get(range, 0), to: get(range, 1), total})}</Text>
          ),
          responsive: true
        }}
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
