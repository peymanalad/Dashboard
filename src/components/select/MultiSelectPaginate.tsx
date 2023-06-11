import React, {FC, useCallback, useRef, useState} from 'react';
import {Image, Select, Spin, Typography} from 'antd';
import map from 'lodash/map';
import remove from 'lodash/remove';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import {useInfinite} from 'hooks';
import {renderImage, renderLabel, renderKey} from 'utils';
import {TagRender} from 'components';
import isFunction from 'lodash/isFunction';
import trim from 'lodash/trim';

export interface props {
  id?: string;
  alignDropDownTop?: boolean;
  isGeneral?: boolean;
  keyPath?: string[];
  keyLabel?: string;
  keyValue: string;
  renderCustomLabel?: (option: any) => string;
  keyImage?: string;
  keySubTitle?: string | string[];
  className?: string;
  listHeight?: number;
  mode?: 'multiple' | 'tags' | 'single';
  url: string;
  urlName?: Array<string | number | undefined | null> | string;
  showValue?: boolean;
  showSearch: boolean;
  searchKey?: string;
  showSubTitle?: boolean;
  placeholder?: any;
  dropDownWith?: number | boolean;
  optionClassName?: string;
  defaultValues?: any;
  value?: any;
  completeValues?: any[];
  onChange?: (items: any | any[], keys?: any | any[]) => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  treeSelect?: boolean;
  allowClear?: boolean;
  params?: object;
  tagColor?: string;
  disabled?: boolean;
  hasImage?: boolean;
  initialFetch?: boolean;
  defaultImage?: string;
  addItem?: (val: any) => void;
  deleteItem?: (val: any) => void;
}

const {Text} = Typography;
const {Option} = Select;

const MultiSelectPaginate: FC<props> = ({
  id,
  alignDropDownTop,
  keyPath = [],
  keyLabel = 'title',
  keyValue,
  renderCustomLabel,
  keySubTitle,
  showValue,
  className,
  listHeight,
  mode = 'single',
  url,
  urlName,
  showSearch,
  searchKey,
  value,
  placeholder,
  dropDownWith,
  optionClassName,
  onChange,
  onDropdownVisibleChange,
  defaultValues,
  treeSelect,
  params,
  allowClear,
  hasImage,
  keyImage,
  showSubTitle,
  defaultImage,
  disabled = false,
  initialFetch = true
}) => {
  const [search, setSearch] = useState<string>('');

  const fetchInfiniteData = useInfinite({
    url,
    name: urlName,
    query: params,
    search: !isEmpty(search) ? {[searchKey || 'search']: search} : undefined
  });

  const debouncedSearch = useRef(
    debounce(async (str) => {
      fetchInfiniteData.remove();
      fetchInfiniteData.fetch({}, {search: trim(str)});
    }, 1500)
  ).current;

  const onSearch = useCallback((str: string) => {
    setSearch(str);
    debouncedSearch(str);
  }, []);

  const chooseLabel = (item: object): string => {
    if (isFunction(renderCustomLabel)) return renderCustomLabel(item);
    return renderLabel(item, [...keyPath, keyLabel]);
  };

  const onSelect = (val: string | string[] | undefined, option: any) => {
    if (onChange && mode !== 'single') {
      const newValue: any = isEmpty(value) ? [option?.item] : [...value, option?.item];
      onChange(newValue, map(newValue, keyValue));
    } else if (onChange) onChange(option?.item, renderKey(option?.item, [...keyPath, keyLabel]));
  };
  const onDeselect = (label: string | string[] | undefined) => {
    if (onChange && mode !== 'single') {
      const newValue: any = [...value];
      remove(newValue, {
        [keyLabel || 'title']: label
      });
      onChange(newValue, map(newValue, keyValue));
    } else if (onChange) onChange(undefined, undefined);
  };

  const onClear = () => {
    if (onChange) onChange([], null);
  };

  return (
    <Select<string | string[] | undefined>
      id={id}
      placeholder={placeholder}
      mode={mode !== 'single' ? mode : undefined}
      allowClear={allowClear}
      defaultValue={
        defaultValues ? (mode !== 'single' ? map(defaultValues, chooseLabel) : chooseLabel(defaultValues)) : undefined
      }
      onSelect={onSelect}
      onDeselect={onDeselect}
      onClear={onClear}
      onDropdownVisibleChange={(open: boolean) => {
        if (open && initialFetch && !fetchInfiniteData?.isFetching) {
          setSearch('');
          fetchInfiniteData.refetch();
        }
        if (onDropdownVisibleChange) onDropdownVisibleChange(open);
      }}
      tagRender={TagRender}
      showArrow
      filterOption={false}
      disabled={disabled}
      dropdownAlign={
        alignDropDownTop
          ? {
              points: ['bl', 'tl'],
              offset: [0, -3],
              overflow: {
                adjustX: 0,
                adjustY: 0
              }
            }
          : {
              points: ['tl', 'bl'],
              offset: [0, 3],
              overflow: {
                adjustX: 3,
                adjustY: 0
              }
            }
      }
      value={value ? (mode !== 'single' ? map(value, chooseLabel) : chooseLabel(value)) : undefined}
      className={className}
      listHeight={listHeight}
      onSearch={onSearch}
      showSearch={showSearch}
      dropdownMatchSelectWidth={dropDownWith}
      getPopupContainer={(trigger: any) => trigger.parentNode}
      onPopupScroll={(e: any) => {
        const {target} = e;
        if (
          target.scrollTop + target.offsetHeight + 3 >= target.scrollHeight &&
          !fetchInfiniteData?.isFetchingNextPage &&
          !fetchInfiniteData?.isFetching &&
          fetchInfiniteData?.data &&
          fetchInfiniteData?.hasNextPage
        ) {
          fetchInfiniteData.fetchNextPage();
        }
      }}>
      {fetchInfiniteData?.isFetching && !fetchInfiniteData?.isFetchingNextPage ? (
        <Option key="spinTop" value="0" disabled>
          <Spin size="small" className="flex-center my-2" />
        </Option>
      ) : (
        map(fetchInfiniteData?.data, (item: any, index: number) => {
          if (!treeSelect) {
            return (
              <Option className={optionClassName} key={index.toString()} item={item} value={chooseLabel(item)}>
                {hasImage && (
                  <Image
                    width={30}
                    height={30}
                    preview={false}
                    className="radius-50"
                    src={renderImage(item, keyImage)}
                    fallback={defaultImage}
                    alt=""
                  />
                )}
                <Text>{`${chooseLabel(item)} ${showValue ? `(${renderKey(item, [...keyPath, keyValue])})` : ''}`}</Text>
                {showSubTitle && (
                  <Text className="mr-2" type="secondary">
                    {renderKey(item, keySubTitle)}
                  </Text>
                )}
              </Option>
            );
          }
          if (treeSelect) {
            return (
              <>
                <Option
                  key={index.toString()}
                  value={renderKey(item, [...keyPath, keyValue])}
                  label={chooseLabel(item)}
                  item={item}>
                  {hasImage && (
                    <Image
                      width={30}
                      preview={false}
                      className="radius-50 ml-3"
                      src={renderImage(item, keyImage)}
                      fallback={defaultImage}
                      alt=""
                    />
                  )}
                  <Text>{`${chooseLabel(item)} ${
                    showValue ? `(${renderKey(item, [...keyPath, keyValue])})` : ''
                  }`}</Text>
                  {showSubTitle && <Text type="secondary">{renderKey(item, keySubTitle)}</Text>}
                </Option>
                {item?.children?.map((i: any, indexChild: number) => (
                  <Option
                    className="mx-5"
                    key={indexChild.toString()}
                    value={renderKey(i, [...keyPath, keyValue])}
                    data={item}
                    label={chooseLabel(i)}>
                    {hasImage && (
                      <Image
                        width={30}
                        preview={false}
                        className="radius-50 ml-3"
                        src={renderImage(item, keyImage)}
                        fallback={defaultImage}
                        alt=""
                      />
                    )}
                    <Text>{`${chooseLabel(item)} ${
                      showValue ? `(${renderKey(item, [...keyPath, keyValue])})` : ''
                    }`}</Text>
                    {showSubTitle && <Text type="secondary">{renderKey(item, keySubTitle)}</Text>}
                  </Option>
                ))}
              </>
            );
          }
        })
      )}
      {fetchInfiniteData?.isFetchingNextPage && (
        <Option key="spinBottom" value="0" disabled>
          <Spin size="small" className="flex-center my-2" />
        </Option>
      )}
    </Select>
  );
};

export default MultiSelectPaginate;
