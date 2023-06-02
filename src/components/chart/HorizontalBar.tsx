import React, {FC} from 'react';
import ReactEcharts, {EChartsOption} from 'echarts-for-react';
import {entries, isArray, isFunction, keys, map, merge, values} from 'lodash';
import {colors} from 'assets';
import {useTranslation} from 'react-i18next';

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

const HorizontalBar: FC<Props> = ({
  data,
  labelKey,
  valueKey,
  height = '250px',
  valueConvertor,
  chartKey,
  labelConvertor,
  showLabel,
  showLegend
}) => {
  const {t} = useTranslation('charts');

  const extractValues = () => {
    if (isArray(data)) {
      if (valueKey) {
        return map(data, valueKey);
      }
    } else {
      return values(data);
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

  let options: EChartsOption;

  !isArray(valueKey)
    ? (options = {
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
        xAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: valueConvertor || undefined
            }
          }
        ],
        yAxis: [
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
            type: 'bar',
            barMinHeight: 10,
            data: extractValues(),
            itemStyle: {
              color: (params: any) => {
                return colors[params.dataIndex];
              }
            },
            label: {
              show: showLabel,
              fontSize: 10
            }
          }
        ]
      })
    : (options = {
        textStyle: {
          fontFamily: 'IRANSansFaNum'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'line'
          }
        },
        legend: {
          show: showLegend,
          formatter: (name: string) => {
            return t(name);
          }
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        dataset: {
          dimensions: ['data', ...valueKey],
          source: map(entries(data), ([key, value]) =>
            merge(value, {data: isFunction(labelConvertor) ? labelConvertor(key) : key})
          )
        },
        yAxis: {type: 'category'},
        xAxis: {type: 'value'},
        series: map(valueKey, () => ({
          type: 'bar',
          barMinHeight: 10,
          label: {
            show: showLabel,
            fontSize: 10
          }
        }))
      });

  return <ReactEcharts option={options} style={{height, width: '100%'}} loadingOption />;
};

export default HorizontalBar;
