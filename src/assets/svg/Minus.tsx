import React from 'react';
import Icon from '@ant-design/icons';

const MinusSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    id="Capa_1"
    x="0px"
    y="0px"
    viewBox="0 0 455.431 455.431"
    width="1em"
    height="1em">
    <g>
      <path
        fill="#B654FF"
        d="M405.493,412.764c-69.689,56.889-287.289,56.889-355.556,0c-69.689-56.889-62.578-300.089,0-364.089  s292.978-64,355.556,0S475.182,355.876,405.493,412.764z"
        data-original="#8DC640"
        data-old_color="#8DC640"
      />
      <g style={{opacity: 0.2}}>
        <path
          fill="#FFFFFF"
          d="M229.138,313.209c-62.578,49.778-132.267,75.378-197.689,76.8   c-48.356-82.489-38.4-283.022,18.489-341.333c51.2-52.622,211.911-62.578,304.356-29.867   C377.049,112.676,330.116,232.142,229.138,313.209z"
          data-original="#FFFFFF"
          data-old_color="#FFFFFF"
        />
      </g>
      <path
        fill="#FFFFFF"
        d="M362.827,227.876c0,14.222-11.378,25.6-25.6,25.6H118.204c-14.222,0-25.6-11.378-25.6-25.6  c0-14.222,11.378-25.6,25.6-25.6h220.444C351.449,202.276,362.827,213.653,362.827,227.876z"
        data-original="#FFFFFF"
        data-old_color="#FFFFFF"
      />
    </g>{' '}
  </svg>
);

const MinusIcon = (props: any) => <Icon component={MinusSvg} {...props} />;

export default MinusIcon;
