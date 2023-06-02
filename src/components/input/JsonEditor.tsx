import React, {CSSProperties} from 'react';
import {useTranslation} from 'react-i18next';
import ReactJson, {InteractionProps, ThemeKeys, ThemeObject} from 'react-json-view';

export interface props {
  value?: any;
  theme?: ThemeObject | ThemeKeys;
  displayObjectSize?: boolean;
  displayDataTypes?: boolean;
  collapsed?: number | boolean;
  disable?: boolean;
  disableClipboard?: boolean;
  style?: CSSProperties;
  onChange?: (value: object) => void;
}
const JsonEditor = ({
  value,
  onChange,
  theme,
  style,
  disable,
  collapsed,
  disableClipboard,
  displayDataTypes,
  displayObjectSize = false
}: props) => {
  const {t} = useTranslation('general');

  const onChangeData = (data: InteractionProps) => {
    if (onChange) onChange(data.updated_src);
  };

  return (
    //@ts-ignore
    <ReactJson
      style={style}
      name={false}
      src={value}
      theme={theme}
      collapsed={collapsed}
      displayDataTypes={displayDataTypes}
      enableClipboard={!disableClipboard}
      quotesOnKeys={false}
      displayObjectSize={displayObjectSize}
      onAdd={!disable && onChangeData}
      onEdit={!disable && onChangeData}
      onDelete={!disable && onChangeData}
      validationMessage={t('json-struct-error')}
    />
  );
};

export default JsonEditor;
