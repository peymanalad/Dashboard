import React from 'react';
import {Tree} from 'antd';
import {DataNode} from 'antd/es/tree';

export interface props {
  treeData: DataNode[];
  defaultValues?: any;
  className?: string;
  value?: any;
  onChange?: (val: any, i: any) => void;
  disabled?: boolean;
}

const TreeSelect = ({treeData, defaultValues, onChange, className, value, disabled}: props) => {
  return (
    <Tree
      showLine={{
        showLeafIcon: false
      }}
      showIcon={false}
      checkable
      disabled={disabled}
      className={className}
      defaultCheckedKeys={defaultValues}
      onCheck={onChange}
      checkedKeys={value}
      treeData={treeData}
    />
  );
};

export default TreeSelect;
