import React, {useState, ReactNode, FC} from 'react';
import {Modal, Select} from 'antd';
import {DrillDownMenu, TagRender} from 'components';
import mapLodash from 'lodash/map';
import removeLodash from 'lodash/remove';
import isEmpty from 'lodash/isEmpty';
import {renderLabel} from 'utils';
import {SelectModeProps} from 'types/general';

export enum DrillDownIsParent {
  notParent,
  parent
}

export interface itemDrillDownMenu {
  id: number;
  name: string;
  is_parent?: DrillDownIsParent;
}

export interface menuProps {
  id?: string;
  title: string;
  moreActionPreTitle?: string;
  keyLabel: string;
  keyBottomLabel?: string;
  moreActionKeyLabel?: string;
  keyValue: string;
  keyImage?: string;
  className?: string;
  notSelectParent?: boolean;
  notSelectChild?: boolean;
  isGeneral?: boolean;
  mode: SelectModeProps;
  onChangeSelectedItems?: (selectedItems: itemDrillDownMenu | itemDrillDownMenu[] | null, keys: any | any[]) => void;
  url: string;
  urlName: string;
  searchKey?: string;
  moreActionUrl?: string;
  moreActionUrlName?: string;
  moreActionIcon?: ReactNode;
  moreActionIsGeneral?: boolean;
  showSearch: boolean;
  moreActionShowSearch?: boolean;
  placeholder?: any;
  dropDownWith?: number | boolean;
  optionClassName?: string;
  defaultValues?: any;
  value?: any;
  onChange?: (items: any | any[], keys?: any | any[]) => void;
  allowClear?: boolean;
  params?: any;
  dataTag?: Array<object>;
  tagColor?: string;
  disabled?: boolean;
}

const DrillDownSelectPaginate: FC<menuProps> = ({
  id,
  title,
  moreActionPreTitle,
  keyLabel,
  keyBottomLabel,
  moreActionKeyLabel,
  keyValue,
  notSelectParent,
  notSelectChild,
  searchKey,
  className,
  isGeneral,
  mode,
  url,
  urlName,
  moreActionIcon,
  moreActionUrl,
  moreActionUrlName,
  showSearch,
  moreActionShowSearch,
  moreActionIsGeneral,
  placeholder,
  value,
  onChange,
  allowClear,
  disabled = false
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const onDeselect = (label: string | string[] | undefined) => {
    if (onChange && mode) {
      const newValue: any = isEmpty(value) ? [] : [...value];
      removeLodash(newValue, {
        [keyLabel || 'title']: label
      });
      onChange(newValue, mapLodash(newValue, keyValue));
    } else if (onChange) onChange(undefined, undefined);
  };

  return (
    <>
      <Modal
        title={title}
        visible={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}>
        <DrillDownMenu
          moreActionPreTitle={moreActionPreTitle}
          mode={mode}
          url={url}
          isGeneral={isGeneral}
          moreActionIsGeneral={moreActionIsGeneral}
          searchKey={searchKey}
          urlName={urlName}
          keyLabel={keyLabel}
          keyBottomLabel={keyBottomLabel}
          keyValue={keyValue}
          notSelectParent={notSelectParent}
          notSelectChild={notSelectChild}
          moreActionKeyLabel={moreActionKeyLabel}
          selectedItems={value}
          onChangeSelectedItems={onChange}
          moreActionUrl={moreActionUrl}
          moreActionUrlName={moreActionUrlName}
          moreActionIcon={moreActionIcon}
          showSearch={showSearch}
          moreActionShowSearch={moreActionShowSearch}
          scrollHeight="55vh"
        />
      </Modal>

      <Select<string | string[] | undefined>
        id={id}
        dropdownClassName="d-none"
        placeholder={placeholder}
        mode={mode === 'multiple' ? mode : undefined}
        allowClear={allowClear}
        value={mode === 'multiple' ? mapLodash(value, keyLabel) : renderLabel(value, keyLabel)}
        onClick={() => {
          setShowModal(true);
        }}
        onDeselect={onDeselect}
        tagRender={TagRender}
        showArrow
        filterOption={false}
        disabled={disabled}
        className={className}
        listHeight={0}
        onChange={onChange}
        showSearch={false}
        dropdownMatchSelectWidth={0}
        getPopupContainer={(trigger) => trigger.parentNode}
      />
    </>
  );
};

export default DrillDownSelectPaginate;
