import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import ReactEcharts, {EChartsOption} from 'echarts-for-react';
import {entries, isArray, isFunction, isString, keys, map, merge, round, values, get, shuffle} from 'lodash';

type Props = {
  data: any;
  labelKey: string;
  valueKey?: string | string[];
  height?: string;
  valueConvertor?: (value: any) => string;
  labelConvertor?: (value: any) => string;
  chartKey?: string;
  showLabel?: boolean;
  showLegend?: boolean;
};

const ELine: FC<Props> = ({
  data,
  labelKey,
  valueKey,
  height = '250px',
  valueConvertor,
  chartKey,
  labelConvertor,
  showLabel
}) => {
  const {t} = useTranslation('charts');

  const extractValues = () => {
    if (isArray(data)) {
      if (isString(valueKey)) {
        return map(data, (item: any) => round(item[valueKey], 2));
      }
    } else if (isArray(valueKey)) {
      map(values(data));
    } else return map(values(data), (item: any) => round(item, 2));
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
      if (isFunction(labelConvertor)) {
        return map(keys(data), labelConvertor);
      }
      return keys(data);
    }
  };

  const options: EChartsOption = !isArray(valueKey)
    ? {
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
      }
    : {
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
        dataset: {
          dimensions: ['data', ...valueKey],
          source: isArray(data)
            ? map(data, (item) =>
                merge(item, {
                  data: isFunction(labelConvertor) ? labelConvertor(get(item, labelKey)) : get(item, labelKey)
                })
              )
            : map(entries(data), ([key, value]) =>
                merge(value, {data: isFunction(labelConvertor) ? labelConvertor(key) : key})
              )
        },
        xAxis: {type: 'category'},
        yAxis: {type: 'value'},
        series: map(valueKey, (value: any) => ({
          type: 'line',
          name: t(value?.key || value),
          smooth: true,
          label: {
            show: showLabel,
            fontSize: 10
          }
        }))
      };
  return (
    <ReactEcharts option={options} style={{height, width: '100%'}} className="flex pie-chart shrink-0" loadingOption />
  );
};

export default ELine;
