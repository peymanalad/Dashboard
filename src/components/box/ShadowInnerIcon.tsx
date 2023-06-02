import React from 'react';
import {Tooltip} from 'antd';

interface props {
  icon: JSX.Element;
  onClick?: () => void;
  text?: string;
  count?: number;
  title?: string;
  className?: string;
  marginX?: string;
}

const ShadowInnerIcon = ({icon, onClick, text, count, title, className, marginX = 'mx-3'}: props) => (
  <Tooltip placement="bottom" title={text}>
    <button
      type="button"
      onClick={onClick}
      className={`min-w-9 h-9 ${marginX} cursor-pointer relative rounded-lg flex-center ${className}`}>
      {title}
      {icon}
      {count && (
        <div
          style={{top: -10, right: -5, backgroundColor: '#fa1616'}}
          className="absolute rounded-full h-5 px-1 min-w-5 flex-center">
          <p className="text-white text-xs mt-1/2 bold">{count}</p>
        </div>
      )}
    </button>
  </Tooltip>
);
export default ShadowInnerIcon;
