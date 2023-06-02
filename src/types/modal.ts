export interface Modal {
  open: string;
  message?: string;
  title?: string;
  okText?: string;
  cancelText?: string;
  content?: any;
  hasLang?: boolean;
  onSuccess?: () => void;
  onFail?: () => void;
  onCancel?: () => void;
  onForcedDelete?: () => void;
}
