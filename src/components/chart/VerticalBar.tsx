import React, {FC, useMemo} from 'react';
import ReactEcharts, {EChartsOption} from 'echarts-for-react';
import {useTranslation} from 'react-i18next';
import {colors} from 'assets';
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

const VerticalBar: FC<Props> = ({
  data,
  labelKey,
  valueKey,
  height = '250px',
  valueConvertor,
  chartKey,
  labelConvertor,
  showLabel = true,
  showLegend = false
}) => {
  const {t} = useTranslation('charts');
  const shuffleColors: string[] = useMemo(() => shuffle(colors), []);

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
          bottom: '5%',
          containLabel: true
        },
        legend: {
          show: showLegend
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
            type: 'bar',
            barMinHeight: 10,
            data: extractValues(),
            itemStyle: {
              color: (params: any) => get(shuffleColors, params?.dataIndex)
            },
            label: {
              show: showLabel,
              fontSize: 10
            }
          }
        ]
      }
    : {
        color: shuffleColors,
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
          show: showLegend
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '5%',
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
          type: 'bar',
          barMinHeight: 10,
          name: t(value?.key || value),
          label: {
            show: showLabel,
            fontSize: 10
          }
        }))
      };

  return <ReactEcharts option={options} style={{height, width: '100%'}} loadingOption />;
};

export default VerticalBar;
