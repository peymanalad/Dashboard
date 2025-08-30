import {windowProcess} from './process';

export const getImageUrl = (imageId: string | number) =>
  `${windowProcess('REACT_APP_BASE_URL')}/File/DownloadBinaryFile?id=${imageId}`;

export const getChatImageUrl = (message: any, encrypted_access_token: string) =>
  `${windowProcess('REACT_APP_BASE_URL')}/Chat/GetUploadedObject?fileId=${message?.id}&contentType=${
    message?.contentType
  }&enc_auth_token=${encodeURIComponent(encrypted_access_token)}`;
