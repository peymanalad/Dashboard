import React, {FC} from 'react';
import {Image, Select, Spin} from 'antd';
import {useFetch} from 'hooks';
import isEmpty from 'lodash/isEmpty';
import mapLodash from 'lodash/map';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import removeLodash from 'lodash/remove';
import TagRender from 'components/tag/TagRender';
import {renderImage, renderLabel, renderKey} from 'utils';
import {SelectTypeProps} from 'types/general';

export interface props {
  id?: string;
  url: string;
  query?: object;
  urlName?: Array<string | number | undefined | null> | string;
  alignDropDownTop?: boolean;
  keyLabel?: string;
  renderCustomLabel?: (option: any) => string;
  keyValue: string;
  keyImage?: string;
  className?: string;
  listHeight?: number;
  optionClassName?: string;
  mode?: SelectTypeProps;
  value?: any;
  disabled?: boolean;
  showSearch?: boolean;
  isGeneral?: boolean;
  allowClear?: boolean;
  treeSelect?: boolean;
  placeholder?: string;
  dropDownWith?: number;
  defaultValues?: any;
  hasImage?: boolean;
  defaultImage?: string;
  onChange?: (val: any, i: any) => void;
}

const MultiSelect: FC<props> = ({
  id,
  alignDropDownTop,
  keyLabel,
  renderCustomLabel,
  keyValue,
  keyImage,
  defaultImage,
  hasImage,
  optionClassName,
  query,
  className,
  listHeight,
  mode,
  url,
  allowClear,
  value,
  urlName,
  showSearch,
  isGeneral,
  treeSelect,
  placeholder,
  disabled,
  dropDownWith,
  defaultValues,
  onChange
}) => {
  const {Option} = Select;

  const fetchData = useFetch({
    url,
    name: urlName,
    isGeneral,
    query
  });

  const onSelect = (val: string | string[] | undefined, option: any) => {
    if (onChange && mode) {
      const newValue: any = isEmpty(value) ? [option?.item] : [...value, option?.item];
      onChange(newValue, mapLodash(newValue, keyValue));
    } else if (onChange) onChange(option?.item, renderKey(option?.item, keyValue));
  };
  const onDeselect = (label: string | string[] | undefined) => {
    if (onChange && mode && isArray(value)) {
      const newValue: any = [...value];
      removeLodash(newValue, {
        [keyLabel || 'title']: label
      });
      onChange(newValue, mapLodash(newValue, keyValue));
    } else if (onChange) onChange(undefined, undefined);
  };

  const chooseLabel = (item: object): string => {
    if (isFunction(renderCustomLabel)) return renderCustomLabel(item);
    return renderLabel(item, keyLabel);
  };

  return (
    <Select<string | string[] | undefined>
      id={id}
      placeholder={placeholder}
      mode={mode}
      allowClear={allowClear}
      disabled={disabled}
      defaultValue={defaultValues}
      value={mode ? mapLodash(value, keyLabel) : chooseLabel(value)}
      onDropdownVisibleChange={(open: any) => {
        if (open && !fetchData?.isFetching && !fetchData?.isFetched) {
          fetchData.refetch();
        }
      }}
      onSelect={onSelect}
      onDeselect={onDeselect}
      tagRender={TagRender}
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
      className={className}
      listHeight={listHeight}
      showSearch={showSearch}
      defaultActiveFirstOption
      filterOption={false}
      dropdownMatchSelectWidth={dropDownWith}
      getPopupContainer={(trigger) => trigger.parentNode}>
      {fetchData?.isFetching || isEmpty(fetchData?.data) ? (
        <Option key="spinTop" value="0" disabled>
          <Spin size="small" className="flex-center my-2" />
        </Option>
      ) : (
        mapLodash(fetchData?.data, (item: any) => {
          if (!treeSelect) {
            return (
              <Option className={optionClassName} key={item?.id} item={item} value={chooseLabel(item)}>
                {hasImage && (
                  <Image
                    width={30}
                    className="radius-50 ml-3"
                    preview={false}
                    src={renderImage(item, keyImage)}
                    fallback={defaultImage}
                    alt=""
                  />
                )}
                {chooseLabel(item)}
              </Option>
            );
          }
          if (treeSelect) {
            return (
              <>
                <Option key={item.toString()} value={renderKey(item, keyValue)} label={chooseLabel(item)} item={item}>
                  {hasImage && (
                    <Image
                      width={30}
                      className="radius-50 ml-3"
                      preview={false}
                      src={renderImage(item, keyImage)}
                      fallback={defaultImage}
                      alt=""
                    />
                  )}
                  {chooseLabel(item)}
                </Option>
                {item?.children?.map((i: any) => (
                  <Option
                    className="mx-5"
                    key={i?.id}
                    value={renderKey(i, keyValue)}
                    data={item}
                    label={chooseLabel(i)}>
                    {hasImage && (
                      <Image
                        width={30}
                        className="radius-50 ml-3"
                        preview={false}
                        src={renderImage(i, keyImage)}
                        fallback={defaultImage}
                        alt=""
                      />
                    )}
                    {chooseLabel(i)}
                  </Option>
                ))}
              </>
            );
          }
        })
      )}
    </Select>
  );
};

export default MultiSelect;
