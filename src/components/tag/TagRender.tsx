import React from 'react';
import {Tag} from 'antd';

function TagRender({label, closable, onClose}: any) {
  return (
    <Tag className="cursor-pointer text-break-spaces m-1" closable={closable} onClose={onClose} onClick={onClose}>
      {label}
    </Tag>
  );
}

export default TagRender;
