export const getTempFileUrl = (fileType: string, fileToken: string, fileName: string) =>
  `https://api.ideed.ir/File/DownloadTempFile?fileType=${fileType}&fileToken=${fileToken}&fileName=${fileName}`;
