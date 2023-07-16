export const getImageUrl = (imageId: string | number) => `https://api.ideed.ir/File/DownloadBinaryFile?id=${imageId}`;

export const getChatImageUrl = (message: any, encrypted_access_token: string) =>
  `https://api.ideed.ir/Chat/GetUploadedObject?fileId=${message?.id}&contentType=${
    message?.contentType
  }&enc_auth_token=${encodeURIComponent(encrypted_access_token)}`;
