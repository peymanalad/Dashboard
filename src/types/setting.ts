import {FileModeProps, FileTypeProps} from 'types/file';
import {SelectModeProps, SelectTypeProps} from 'types/general';

export interface searchOptionsProps {
  search?: string;
}

export type itemElementType =
  | 'object'
  | 'array'
  | 'number'
  | 'string'
  | 'color'
  | 'file'
  | 'text'
  | 'html'
  | 'select'
  | 'dateTime'
  | 'checkBox';

export interface itemSelectOptionProps {
  mode: SelectModeProps;
  data: Array<object> | string;
  params?: object;
  value: string;
  type?: SelectTypeProps;
}

export interface itemSelectOptionLabelProps extends itemSelectOptionProps {
  label: string;
}

export interface itemSelectOptionRenderLabelProps extends itemSelectOptionProps {
  renderLabel: (option: any) => string;
}

export interface itemFileOptionProps {
  mode: FileModeProps;
  type: FileTypeProps;
}

type disabledFunction = (dependencies: any[]) => boolean;

export interface itemElementProps {
  name?: string;
  title?: string;
  type: itemElementType;
  options?: itemSelectOptionLabelProps | itemSelectOptionRenderLabelProps | itemFileOptionProps;
  disabled?: disabledFunction | boolean;
  dependencies?: Array<string[] | string>;
  size: number;
  elements?: itemElementProps[];
}

export interface ConfigSearch {
  name?: string;
  key?: string;
}
