import {ReactNode} from 'react';

export interface DropDownTypeValue {
  meta: metaType;
  data: Array<Object>;
  loading: boolean;
  params: object;
  call(val1: object, val2: object): () => void;
  onSearchDisease: () => void;
  currentPage: number;
  setCurrentPage(currentPage: number): () => void;
  renderOptions(item: ReactNode): ReactNode;
  onClick: () => void;
  onChange: () => void;
  className: string;
  defaultValue: string;
  mode: string;
  keyByName: boolean;
  keyByLink: boolean;
  onBlur: () => void;
  dropDownWith: string;
  tagColor: string;
  alignDropDownTop: boolean;
}
export interface metaType {
  current_page?: number;
  last_page?: number;
}
