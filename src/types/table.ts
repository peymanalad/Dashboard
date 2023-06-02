export interface table {
  dataSource: Array<object>;
  columns: Array<object>;
  meta: any;
  links: Array<object>;
  itemRender?: any;
  onChangePage?: () => void;
  modalContent?: string;
  visibleDeleteModal: boolean;
  deleteMedicine?: () => void;
  setVisibleDeleteModal?: any;
  loadingDelete: boolean;
}
