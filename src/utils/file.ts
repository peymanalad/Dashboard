export const getTempFileUrl = (fileType: string, fileToken: string, fileName: string) =>
  `${process.env.REACT_APP_BASE_URL}/File/DownloadTempFile?fileType=${fileType}&fileToken=${fileToken}&fileName=${fileName}`;
