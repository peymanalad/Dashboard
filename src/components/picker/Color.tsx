import React, {useState} from 'react';
import {Input, Modal} from 'antd';
import {ColorPicker, useColor} from 'react-color-palette';

export interface props {
  id?: string;
  title?: string;
  zoom?: number;
  defaultValues?: any;
  value?: string;
  onChange?: (color: any) => void;
  onClick?: (val: any) => void;
  disabled?: boolean;
}

const ColorPickerModal = ({id, title, defaultValues, onChange, value, disabled}: props) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [color, setColor] = useColor('hex', '#121212');

  return (
    <>
      <Modal
        title={title}
        visible={showColorPicker}
        closable={false}
        width={310}
        bodyStyle={{padding: '5px'}}
        onCancel={() => {
          setShowColorPicker(false);
        }}
        footer={null}>
        <ColorPicker
          width={300}
          height={200}
          color={color}
          onChange={(val) => {
            setColor(val);
            if (onChange && 'hex' in val) {
              onChange(val?.hex);
            }
          }}
          hideHSV
          alpha
          hideRGB
        />
      </Modal>
      <Input
        className="color-input"
        id={id}
        allowClear
        style={{backgroundColor: value}}
        onClick={() => {
          if (!disabled) setShowColorPicker(true);
        }}
      />
    </>
  );
};

export default ColorPickerModal;
