import React, {FC} from 'react';
import ReactEcharts, {EChartsOption} from 'echarts-for-react';
import {map} from 'lodash';
import {colors} from 'assets';

type Props = {
  data: any;
  labelKey: string;
  valueKey: string;
  height?: string;
  valueFormatter?: (value: any) => string;
  labelConvertor?: (value: any) => string;
  chartKey?: string;
  suffix?: string;
  showLabel?: boolean;
  showValue?: boolean;
  showLegend?: boolean;
};

const EPie: FC<Props> = ({
  data,
  labelKey,
  valueKey,
  height = '250px',
  chartKey,
  suffix,
  showLabel = true,
  showValue = false,
  showLegend = false
}) => {
  const dataConvertor = () => {
    return map(data, (item) => ({
      name: item[labelKey],
      value: item[valueKey]
    }));
  };

  const options: EChartsOption = {
    textStyle: {
      fontFamily: 'IRANSansFaNum'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: showLegend,
      type: 'scroll',
      orient: 'horizontal',
      top: 0
    },
    series: [
      {
        name: chartKey || '',
        type: 'pie',
        radius: ['40%', '85%'],
        itemStyle: {
          color: (params: any) => {
            return colors[params.dataIndex];
          }
        },
        label: {
          show: showValue || showLabel,
          position: showValue ? 'inside' : 'outside',
          formatter: `${showValue ? `{c}${suffix || ''}` : '{b}'}`,
          fontSize: '10px',
          fontWeight: 'bold'
        },
        labelLine: {
          show: true
        },
        data: dataConvertor()
      }
    ]
  };

  return <ReactEcharts option={options} style={{height, width: '100%'}} loadingOption />;
};

export default EPie;
