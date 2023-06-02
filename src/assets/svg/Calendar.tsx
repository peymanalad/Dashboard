import React from 'react';
import Icon from '@ant-design/icons';

const CalenderSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" height="1em" viewBox="0 0 512 512" width="1em">
    <g>
      <g>
        <path
          d="m512 160v286c0 36.39-29.61 66-66 66h-380c-36.39 0-66-29.61-66-66v-286c0-8.84 7.16-16 16-16h480c8.84 0 16 7.16 16 16z"
          fill="#e2e0e0"
          data-original="#E2E0E0"
          data-old_color="#e2e0e0"
        />
        <path
          d="m512 160v286c0 36.39-29.61 66-66 66h-32c36.39 0 66-29.61 66-66v-286z"
          fill="#cecccc"
          data-original="#CECCCC"
        />
        <path
          d="m512 106v70h-512v-70c0-36.451 29.549-66 66-66h380c36.451 0 66 29.549 66 66z"
          fill="#acebe2"
          data-original="#ACEBE2"
          data-old_color="#acebe2"
        />
        <path
          d="m512 106v70h-32v-70c0-36.45-29.55-66-66-66h32c36.45 0 66 29.55 66 66z"
          fill="#98d7ce"
          data-original="#98D7CE"
          data-old_color="#98d7ce"
        />
        <g fill="#f79caf">
          <path
            d="m128 104c-8.837 0-16-7.164-16-16v-72c0-8.836 7.163-16 16-16s16 7.164 16 16v72c0 8.836-7.163 16-16 16z"
            data-original="#F79CAF"
            fill="#E6607C"
            data-old_color="#F79CAF"
          />
          <path
            d="m384 104c-8.837 0-16-7.164-16-16v-72c0-8.836 7.163-16 16-16s16 7.164 16 16v72c0 8.836-7.163 16-16 16z"
            data-original="#F79CAF"
            fill="#E6607C"
            data-old_color="#F79CAF"
          />
        </g>
      </g>
    </g>
  </svg>
);

const CalenderIcon = (props: any) => <Icon component={CalenderSvg} {...props} />;

export default CalenderIcon;
