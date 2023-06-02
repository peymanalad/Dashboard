import React, {FC} from 'react';
import ReactEcharts, {EChartsOption} from 'echarts-for-react';
import {isArray, isFunction, keys, map, round, values} from 'lodash';

type Props = {
  data: any;
  labelKey?: string;
  valueKey?: string;
  height?: string;
  valueConvertor?: (value: any) => string;
  labelConvertor?: (value: any) => string;
  chartKey?: string;
  showLabel?: boolean;
  showLegend?: boolean;
};

const ELine: FC<Props> = ({data, labelKey, valueKey, height = '250px', valueConvertor, chartKey, labelConvertor}) => {
  const extractValues = () => {
    if (isArray(data)) {
      if (valueKey) {
        return map(data, valueKey);
      }
    } else {
      return map(values(data), (item: any) => round(item, 2));
    }
  };

  const extractLabels = () => {
    if (isArray(data)) {
      if (labelKey) {
        if (isFunction(labelConvertor)) {
          return map(data, (item) => labelConvertor(item[labelKey]));
        }
        return map(data, labelKey);
      }
    } else {
      return keys(data);
    }
  };

  const options: EChartsOption = {
    textStyle: {
      fontFamily: 'IRANSansFaNum'
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'line'
      }
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '10%',
      containLabel: true
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: valueConvertor || undefined
        }
      }
    ],
    xAxis: [
      {
        data: extractLabels(),
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          padding: 5
        },
        type: 'category'
      }
    ],
    series: [
      {
        name: chartKey || '',
        type: 'line',
        smooth: true,
        data: extractValues(),
        label: {
          show: true,
          fontSize: 10
        }
      }
    ]
  };
  return (
    <ReactEcharts option={options} style={{height, width: '100%'}} className="flex pie-chart shrink-0" loadingOption />
  );
};

export default ELine;
