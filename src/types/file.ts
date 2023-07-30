export type FileModeProps = 'multiple' | 'single';

export type FileTypeProps = 'image' | 'sound' | 'video' | 'pdf' | 'excel' | 'application' | 'image,video';

export type uploadAdvancedInputType = 'messages' | 'visits' | 'recommendations';

export type uploadType =
  | 'users'
  | 'applications'
  | 'messages'
  | 'posts'
  | 'postGroups'
  | 'visits'
  | 'banks'
  | 'recommendations'
  | 'diseases'
  | 'sources'
  | 'configs'
  | 'products';

export interface ImagesDataShow {
  name?: string;
  imagePath: string;
  path: string;
}

export interface ImageDataUpload {
  uid: string;
  name: string;
  status?: string;
  url: string;
  path: string;
}
