import {windowProcess} from './process';

export const getTempFileUrl = (fileType: string, fileToken: string, fileName: string) =>
  `${windowProcess(
    'REACT_APP_BASE_URL'
  )}/File/DownloadTempFile?fileType=${fileType}&fileToken=${fileToken}&fileName=${fileName}`;

export function getMimeTypeFromFileName(fileName: string): string | undefined {
  if (!fileName?.length) return undefined;
  const mimeTypes: {[key: string]: string} = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
    // Add more file extensions and MIME types as needed
  };

  const lastDotIndex = fileName?.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    const fileExtension = fileName?.slice(lastDotIndex);
    return mimeTypes[fileExtension?.toLowerCase()] || undefined;
  }

  return undefined;
}
