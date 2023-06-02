import React from 'react';
import {Select, Spin, Tag} from 'antd';
import forEach from 'lodash/forEach';
import debounce from 'lodash/debounce';

const DropDown = ({
  id,
  meta,
  data,
  loading,
  params,
  call,
  currentPage,
  setCurrentPage,
  renderOptions,
  onClick,
  onChange,
  className,
  defaultValue,
  mode,
  keyByName,
  keyByLink,
  dropDownWith,
  tagColor,
  alignDropDownTop = false,
  listHeight,
  dataTag,
  showSearch = false,
  placeholder,
  value
}: any) => {
  const {Option} = Select;
  const tagRender = (props: any) => {
    const {label, closable, onClose, value} = props;
    let tagLabel = '';
    forEach(dataTag, (_: any) => {
      if (_?.id === value) tagLabel = _.name;
    });
    const renderLabel = () => {
      if (dataTag && typeof label === 'number') return tagLabel;
      return label;
    };
    return (
      <Tag color={tagColor} closable={closable} onClose={onClose} style={{marginRight: 3}}>
        {renderLabel()}
      </Tag>
    );
  };
  const debounced = debounce((e) => call({}, {search: e}), 500);
  const onSearch = (e: any) => {
    if (call) debounced(e);
  };
  return (
    <Select
      id={id}
      placeholder={placeholder}
      mode={mode || null}
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
      tagRender={tagRender}
      value={value}
      onClick={onClick}
      showSearch={showSearch}
      defaultValue={defaultValue}
      onChange={(val, i) => onChange(val, i)}
      onSearch={onSearch}
      defaultActiveFirstOption
      notFoundContent={loading ? <Spin size="small" className="flex-center my-2" /> : null}
      filterOption={false}
      dropdownMatchSelectWidth={dropDownWith}
      getPopupContainer={(trigger) => trigger.parentNode}
      onPopupScroll={(e: any) => {
        const {target} = e;
        if (
          target.scrollTop + target.offsetHeight === target.scrollHeight &&
          meta?.current_page <= meta?.last_page &&
          !loading
        ) {
          setCurrentPage(currentPage + 1);
          // call({}, params);
        }
      }}>
      {data?.map((item: any) => (
        <Option key={item?.id} value={keyByName ? item?.name : keyByLink ? item?.link : item?.id}>
          {renderOptions(item)}
        </Option>
      ))}
    </Select>
  );
};

export default DropDown;
