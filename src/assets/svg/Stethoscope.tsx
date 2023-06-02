import React from 'react';
import Icon from '@ant-design/icons';

export interface props {
  height: string;
  width: string;
}

const StethoscopeSvg = ({height, width}: props) => (
  <svg
    id="Capa_1"
    enableBackground="new 0 0 512 512"
    height={height}
    viewBox="0 0 512 512"
    width={width}
    xmlns="http://www.w3.org/2000/svg">
    <g>
      <path
        fill="#8a8a8a"
        d="m164 329.414v46.586c0 74.443 60.557 136 135 136s135-61.557 135-136v-16.518c34.191-6.969 60-37.266 60-73.482 0-41.353-33.647-75-75-75s-75 33.647-75 75c0 36.216 25.809 66.513 60 73.482v16.518c0 57.891-47.109 106-105 106s-105-48.109-105-106v-46.567c61.218-11.23 131.867-87.244 144.097-159.551 8.02-47.494-11.796-85.514-54.097-104.531v-20.351c0-24.814-20.186-45-45-45s-45 20.186-45 45 20.186 45 45 45h26.631c34.515 12.779 49.021 38.571 42.876 74.887-10.532 62.329-80.728 136.113-129.507 136.113-54.633 0-130.567-86.758-131.027-151-.205-28.635 14.798-49.167 43.993-60h27.034c24.814 0 45-20.186 45-45s-20.185-45-45-45-45 20.186-45 45v20.184c-36.083 16.158-56.078 46.436-56 84.816.153 75.214 78.081 166.832 146 179.414zm240-58.414h30v30h-30z"
      />
    </g>
  </svg>
);

const StethoscopeIcon = (props: any) => <Icon component={StethoscopeSvg} {...props} />;

export default StethoscopeIcon;
