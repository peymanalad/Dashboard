import React, {Fragment, useState} from 'react';
import {Col, Input, Modal, Row, TimePicker, Typography} from 'antd';
import {CalendarOutlined} from '@ant-design/icons';
import {Calendar, CalenderProps} from 'react-datepicker2';
import {convertTimeToLocalMoment, convertTimeToUTC, convertUtcTimeToLocal} from 'utils';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import split from 'lodash/split';
import first from 'lodash/first';
import last from 'lodash/last';
import {Moment} from 'moment-jalaali';
import {useTranslation} from 'react-i18next';

export interface props {
  title?: string;
  format?: string;
  zoom?: number;
  isGregorian?: boolean;
  timePicker?: boolean;
  value?: string;
  ranges?: CalenderProps['ranges'];
  min?: Moment;
  max?: Moment;
  onChange?: (dateTime: string | null) => void;
  disabled?: boolean;
}

const {Text} = Typography;

const DateTimePicker = ({
  title,
  onChange,
  value,
  format,
  disabled,
  isGregorian = false,
  timePicker,
  ranges,
  min,
  max
}: props) => {
  const {t}: {t: any} = useTranslation('general');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const setDateTime = (dateTime: string | null = null) => {
    if (isFunction(onChange)) onChange(dateTime);
  };

  return (
    <Fragment>
      <Modal
        title={title}
        visible={showDatePicker}
        closable={false}
        className="date-picker-modal"
        onCancel={() => {
          setShowDatePicker(false);
        }}
        footer={null}>
        <Row gutter={[16, 8]} className="date-picker-container w-full">
          {timePicker && (
            <Col span={24} className="w-full">
              <Text>{t('timeSelection')}</Text>
              <TimePicker
                className="w-full mt-1/2"
                popupClassName="time-picker-modal"
                value={isString(value) ? convertTimeToLocalMoment(value) : undefined}
                onChange={(timeMoment: any, time: any) => {
                  setDateTime(
                    convertTimeToUTC(
                      `${convertTimeToUTC(value || timeMoment || '', 'jYYYY-jMM-jDD', true)} ${time}`,
                      'YYYY-MM-DD HH:mm:ss',
                      false,
                      'jYYYY-jMM-jDD HH:mm:ss'
                    )
                  );
                }}
              />
            </Col>
          )}
          <Col className="w-full">
            {timePicker && <Text>{t('dateSelection')}</Text>}
            {/*@ts-ignore*/}
            <Calendar
              min={min}
              max={max}
              isGregorian={isGregorian}
              ranges={ranges}
              value={isString(value) ? convertTimeToLocalMoment(value) : undefined}
              onChange={(date) => {
                if (timePicker) {
                  if (last(split(value, ' ')))
                    setDateTime(
                      `${first(split(convertTimeToUTC(date, format, true), ' '))} ${last(split(value, ' '))}`
                    );
                  else setDateTime(convertTimeToUTC(date, format, true));
                } else setDateTime(convertTimeToUTC(date, 'YYYY-MM-DD', true));
                setShowDatePicker(false);
              }}
            />
          </Col>
        </Row>
      </Modal>
      <Input
        allowClear
        onChange={() => {
          setDateTime();
        }}
        disabled={disabled}
        className="input-center"
        value={
          value
            ? isGregorian
              ? convertUtcTimeToLocal(value, timePicker ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD')
              : convertUtcTimeToLocal(value, timePicker ? 'jYYYY/jMM/jDD HH:mm:ss' : 'jYYYY/jMM/jDD')
            : undefined
        }
        prefix={<CalendarOutlined />}
        onClick={() => {
          if (!disabled) setShowDatePicker(true);
        }}
      />
    </Fragment>
  );
};

export default DateTimePicker;
