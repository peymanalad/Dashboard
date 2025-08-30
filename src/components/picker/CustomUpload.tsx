import React, {useState, ReactNode, memo, useMemo, useRef, ElementRef, useEffect} from 'react';
import {Upload, Modal, message, Image, Button, Typography, Row, Col, Avatar} from 'antd';
import {
  PictureOutlined,
  FilePdfOutlined,
  SoundOutlined,
  VideoCameraAddOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {CropImageModal} from 'components';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {filterObject, flatObject, getMimeTypeFromFileName, reorderList, ResponseErrorHandler} from 'utils';
import filter from 'lodash/filter';
import toString from 'lodash/toString';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import get from 'lodash/get';
import first from 'lodash/first';
import split from 'lodash/split';
import last from 'lodash/last';
import min from 'lodash/min';
import {useUser} from 'hooks';
import cloneWith from 'lodash/cloneWith';
import isFunction from 'lodash/isFunction';
import {v4 as uuidv4} from 'uuid';
import {maxSizeType, maxSizeExtension} from 'assets';
import {windowProcess} from 'utils/process';
import type {UploadProps} from 'antd/lib/upload/interface';
import type {FileTypeProps, FileModeProps, UploadType} from 'types/file';
const DragDropContextAny = DragDropContext as any;
const DroppableAny = Droppable as any;
const DraggableAny = Draggable as any;

interface props {
  mode: FileModeProps;
  maxFile?: number;
  name?: string;
  label?: string;
  aspect?: number;
  hasCrop?: boolean;
  multiple?: boolean;
  hasChangeCrop?: boolean;
  notifyDelete?: boolean;
  typeFile: FileTypeProps;
  uploadButton?: (isLoading: boolean, disabled?: boolean) => ReactNode;
  type: UploadType;
  listType?: UploadProps['listType'];
  showUploadList?: UploadProps['showUploadList'];
  outPutKeys?: string | string[];
  onChange?: (files: any) => void;
  onUpload?: (files: any) => void;
  onUploading?: (isUploading: boolean) => void;
  className?: string;
  disabled?: boolean;
  sortable?: boolean;
  value?: any;
  imageHint?: boolean;
  hint?: string;
  maxWidth?: number;
  maxHeight?: number;
  'aria-invalid'?: string;
}

const {Text} = Typography;

const CustomUpload = ({
  mode,
  maxFile = Infinity,
  name,
  label,
  value,
  onChange,
  multiple,
  onUpload,
  onUploading,
  typeFile,
  type,
  aspect,
  className,
  listType = 'picture-card',
  uploadButton,
  disabled,
  sortable = false,
  outPutKeys,
  hasCrop,
  hasChangeCrop,
  notifyDelete = true,
  showUploadList = true,
  imageHint,
  hint,
  maxWidth,
  maxHeight,
  ...props
}: props) => {
  const {t} = useTranslation('general');
  const antdUploadRef = useRef<ElementRef<typeof Upload>>(null);
  const user = useUser();
  const valueCache = useRef(value);

  const headers = {
    Authorization: `Bearer ${user?.access_token}`,
    'content-type': 'multipart/form-data'
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [isDraggingMode, setIsDraggingMode] = useState<boolean>(false);
  const [valueState, setValueState] = useState<any | undefined>();

  useEffect(() => onUploading && onUploading(isLoading), [isLoading]);

  useEffect(() => {
    valueCache.current = value;
  }, [value]);

  useEffect(() => {
    const onPaste = (event: any) => {
      const {files} = event.clipboardData;
      if (!isEmpty(files)) sendFileOnPaste(files);
    };
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('paste', onPaste);
    };
  }, []);

  const getWidthHeightImage = (file: File) => {
    return new Promise<{width: number; height: number}>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new window.Image();
        img.src = toString(reader.result);
        img.onload = () => resolve({width: img?.width, height: img?.height});
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const getMaxSize = (typeFile: string | undefined): number => {
    const maxSizePerType = get(maxSizeType, type);
    const maxSizePerFile = typeFile ? get(maxSizeExtension, typeFile) : undefined;
    return min([maxSizePerFile, maxSizePerType]) || Infinity;
  };

  function isFileTypeAllowed(fileType: string): boolean {
    const acceptedTypeArray = getAccess.split(',');

    for (const acceptedType of acceptedTypeArray) {
      const pattern = new RegExp(`^${acceptedType.trim().replace(/\*/g, '.*').replace('/', '\\/')}$`);

      if (pattern.test(fileType)) {
        return true;
      }
    }

    return false;
  }

  const checkConditionForSendFile = (files: any) =>
    new Promise<string | null>((resolve, reject) => {
      if (!isFileTypeAllowed(files.file?.type)) {
        reject(t('fileTypeError'));
      }
      if (imageHint && maxHeight && maxWidth) {
        getWidthHeightImage(files.file)
          .then((detailImage) => {
            if (detailImage.width > maxWidth && detailImage.height > maxHeight) {
              reject(`${t('imageHint', {width: maxWidth, height: maxHeight})}`);
            }
          })
          .catch(() => {
            resolve(null);
          });
      }
      if (getMaxSize(last(split(files?.file?.name, '.'))) < files?.file?.size / 1000) {
        reject(`${t('fileSizeError', {max: getMaxSize(last(split(files?.file?.name, '.'))) / 1000})}`);
      }
      resolve(null);
    });

  const customRequest = async (files: any) => {
    const uniqueId = uuidv4();
    checkConditionForSendFile(files)
      .then(async () => {
        const formData = new FormData();
        formData.append('file', files.file);
        formData.append('FileName', files.file?.name);
        formData.append('FileType', files.file?.type);
        formData.append('FileToken', uniqueId);
        const config = {
          headers: files.headers,
          timeout: 1200000,
          onUploadProgress: (event: any) => {
            if (files?.onProgress) files.onProgress({percent: (event.loaded / event.total) * 100, uniqueId});
          }
        };
        try {
          const res = await axios.post(files.action, formData, config);
          if (res?.status === 200) {
            message.success(t('file_uploaded_successfully'));
            if (files?.onSuccess) {
              let thumbUrl;
              if (files.file.type?.startsWith('image/')) thumbUrl = await getBase64(files.file);
              files.onSuccess({fileToken: uniqueId, ...res?.data?.result, thumbUrl} || {fileToken: uniqueId}, uniqueId);
            }
          } else {
            message.error(t('file_upload_failed'));
            if (files?.onError) files.onError();
          }
        } catch (err: any) {
          ResponseErrorHandler(err);
          if (files?.onError) files.onError({err, id: uniqueId});
        }
      })
      .catch((error) => {
        message.error(error);
        if (files?.onError) files.onError({...error, id: uniqueId});
      });
  };

  const onRemove = (file: any) => {
    if (notifyDelete && (file?.url || file?.fileToken)) {
      const formData = new URLSearchParams();
      formData.append('path', file?.fileToken || file?.url);
      formData.append('type', type);
      // const options: any = {
      //   method: 'DELETE',
      //   headers: {
      //     Authorization: `Bearer ${user?.access_token}`,
      //     'content-type': 'application/x-www-form-urlencoded'
      //   },
      //   data: formData,
      //   url: 'https://mobinn.ir/general/v1/files/delete'
      // };
      return new Promise<boolean>((resolve) => {
        Modal.error({
          title: t('delete'),
          content: t('messages.deleteFile'),
          okType: 'danger',
          icon: <Avatar className="float-left" size={50} src={file?.thumbUrl} />,
          okText: t('delete'),
          className: 'delete',
          cancelText: t('cancel'),
          okCancel: true,
          onOk: () => {
            resolve(true);
            message.success(t('file_delete_successfully_save'), 5);
            // axios(options)
            //   .then(() => {
            //     message.success(t('file_delete_successfully'));
            //     resolve(true);
            //   })
            //   .catch(() => {
            //     message.error(t('file_delete_failed'));
            //     resolve(true);
            //   });
          }
        });
      });
    }
    return true;
  };

  const getAction = useMemo(() => {
    switch (type) {
      case 'users':
        return `${windowProcess('REACT_APP_BASE_URL')}/Profile/UploadProfilePicture`;
      case 'applications':
        return `${windowProcess('REACT_APP_BASE_URL')}/SoftwareUpdates/UploadUpdateFileFile`;
      case 'posts':
        return `${windowProcess('REACT_APP_BASE_URL')}/Posts/UploadPostFileFile`;
      case 'postGroups':
        return `${windowProcess('REACT_APP_BASE_URL')}/PostGroups/UploadGroupFileFile`;
      case 'postSubGroups':
        return `${windowProcess('REACT_APP_BASE_URL')}/PostGroups/UploadGroupFileFile`;
      default:
        return `${windowProcess('REACT_APP_BASE_URL')}/SoftwareUpdates/UploadUpdateFileFile`;
    }
  }, []);

  const getAccess = useMemo(() => {
    switch (typeFile) {
      case 'image,video,pdf':
        return 'image/*, video/*, application/pdf';
      case 'image':
        return 'image/*';
      case 'sound':
        return 'audio/*';
      case 'video':
        return 'video/*';
      case 'pdf':
        return 'application/pdf';
      case 'application':
        return 'application/vnd.android.package-archive';
      case 'excel':
        return '.csv ,application/vnd.ms-excel ,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return 'image/*';
    }
  }, [typeFile]);

  const getIcon = useMemo(() => {
    const textColor: string = disabled ? 'text-gray' : 'text-black';
    switch (typeFile) {
      case 'image':
        return <PictureOutlined className={textColor} />;
      case 'sound':
        return <SoundOutlined className={textColor} />;
      case 'video':
        return <VideoCameraAddOutlined className={textColor} />;
      case 'pdf':
        return <FilePdfOutlined className={textColor} />;
      default:
        return null;
    }
  }, [typeFile]);

  const onChangeFile = (file: any) => {
    let files = filter(file?.fileList, (data: any) => data?.status !== 'error');
    files = map(files, (file: any) => {
      if (isString(file.response)) return {...file, path: file.response};
      if (file.response) return {...file, ...file.response};
      return file;
    });
    if (file?.file?.status === 'uploading') setIsLoading(true);
    else if (file?.file?.status === 'error') setIsLoading(false);
    else if (file?.file?.status === 'done') {
      setIsLoading(false);
      files = map(files, (f: object) => filterObject(f, outPutKeys));
      if (mode === 'single') files = flatObject(first(files));
      else files = map(files, (f: object) => flatObject(f));
      if (onUpload) onUpload(files);
    }
    if (onChange) onChange(isEmpty(files) ? undefined : files);
    else setValueState(isEmpty(files) ? undefined : files);
  };

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
  };

  const renderButton = (): ReactNode => {
    if (isFunction(uploadButton)) return uploadButton(isLoading, disabled);
    return (
      <Button
        loading={isLoading}
        style={{width: '95%', height: '95%'}}
        className={`bg-white flex-col flex-center border-1 border-dashed ${
          disabled ? 'border-gray' : props?.['aria-invalid'] ? 'border-error' : 'border-black'
        }`}>
        {getIcon}
        <Text className="m-0">{label || t('upload')}</Text>
      </Button>
    );
  };

  const createFileListFromValue = useMemo((): any[] => {
    if (isArray(value || valueState))
      return map(value || valueState, (file: any, index: number) => {
        if (isString(file))
          return {
            uid: index.toString(),
            name,
            status: 'done',
            url: file,
            type: getAccess?.includes(',') ? '*/*' : getAccess
          };
        return {
          uid: index.toString(),
          name,
          status: 'done',
          path: file?.path || file?.picture,
          url: file?.path_url || file?.picture_url,
          ...file,
          type: getAccess?.includes(',') ? getMimeTypeFromFileName(file?.fileName) || '*/*' : getAccess
        };
      });
    if (isString(value || valueState))
      return [
        {
          uid: 0,
          name,
          status: 'done',
          url: value || valueState,
          type: getAccess?.includes(',') ? '*/*' : getAccess
        }
      ];
    if (!isEmpty(value || valueState))
      return [
        {
          uid: 0,
          name,
          status: 'done',
          path: (value || valueState)?.path || (value || valueState)?.picture,
          url: (value || valueState)?.path_url || (value || valueState)?.picture_url,
          ...(value || valueState),
          type: getAccess?.includes(',') ? '*/*' : getAccess
        }
      ];
    return [];
  }, [value, valueState]);

  const getItemStyle = (isDraggingMode: any, draggableStyle: any) => ({
    userSelect: 'none',
    width: '104px',
    height: '104px',
    background: isDraggingMode ? 'lightgreen' : 'white',
    ...draggableStyle
  });

  const getListStyle = (isDraggingModeOver: any) => ({
    background: isDraggingModeOver ? 'lightblue' : 'white',
    display: 'flex',
    padding: sortable ? 8 : 0,
    overflow: !sortable || mode === 'single' ? 'hidden' : 'auto'
  });

  const Uploader = (isDraggingOver: boolean) => {
    return (
      <Upload
        ref={antdUploadRef}
        fileList={createFileListFromValue}
        onPreview={handlePreview}
        className={`${sortable ? 'ltr' : ''} ${className}`}
        accept={getAccess}
        showUploadList={
          showUploadList
            ? {
                showDownloadIcon: getAccess !== 'image/*',
                showPreviewIcon: getAccess === 'image/*'
              }
            : false
        }
        itemRender={(originNode: any, file: any, fileList) => {
          const index = findIndex(fileList, ['uid', file?.uid]);
          return (
            <DraggableAny key={index} draggableId={toString(index)} index={index} isDragDisabled={!isDraggingMode}>
              {(provided: any, snapshot: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={isDraggingMode && !isDraggingOver ? 'shake-animation' : undefined}
                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                  {originNode}
                </div>
              )}
            </DraggableAny>
          );
        }}
        onChange={onChangeFile}
        disabled={isLoading || disabled}
        action={getAction}
        headers={headers}
        multiple={multiple}
        method="POST"
        customRequest={customRequest}
        onRemove={onRemove}
        name={name}
        listType={listType}>
        {isDraggingMode || value?.length >= maxFile || (mode === 'single' && value) ? null : renderButton()}
      </Upload>
    );
  };

  const sendFileOnPaste = (files: FileList | any) => {
    for (const file of files) {
      checkConditionForSendFile({file})
        .then(() => {
          customRequest({
            file,
            action: getAction,
            headers,
            onError: () => {
              if (onChange) onChange(value);
              else setValueState(valueState);
            },
            onProgress: ({percent, uniqueId}: any) => {
              const newImage = {
                id: uniqueId,
                originFileObj: file,
                status: 'uploading',
                type: file?.type,
                percent
              };
              if (onChange)
                onChange(
                  valueCache.current
                    ? [...valueCache.current?.filter((img: any) => img.id !== uniqueId), newImage]
                    : [newImage]
                );
              else
                setValueState(
                  valueState ? [...valueState?.filter((img: any) => img.id !== uniqueId), newImage] : [newImage]
                );
            },
            onSuccess: (response: any, id: any) => {
              if (isString(response)) response = {path: response};
              const newImage = {
                originFileObj: file,
                status: 'done',
                type: file?.type,
                response,
                ...response
              };
              if (onChange)
                onChange(
                  valueCache.current
                    ? [...valueCache.current?.filter((img: any) => img.id !== id), newImage]
                    : [newImage]
                );
              else
                setValueState(valueState ? [...valueState?.filter((img: any) => img.id !== id), newImage] : [newImage]);
            },
            status: 'uploading'
          });
        })
        .catch((error: any) => {
          message.error(error);
          if (onChange) onChange(valueCache.current?.filter((img: any) => img.id !== error.id));
          else setValueState(valueState?.filter((img: any) => img.id !== error.id));
        });
    }
  };

  return (
    <Row className="w-full flex flex-col">
      {sortable && (
        <Col span={8} xs={24} md={8}>
          <Button
            type="dashed"
            className="ant-btn-success"
            icon={<SortAscendingOutlined />}
            ghost
            onClick={() => {
              setIsDraggingMode((prevState: boolean) => !prevState);
            }}>
            {!isDraggingMode ? t('sort_images') : t('apply')}
          </Button>
        </Col>
      )}
        <DragDropContextAny
        onDragEnd={(result: any) => {
          if (onChange) {
            onChange(
              cloneWith(value, (copyValue: any[]) =>
                reorderList(copyValue, result.source.index, result?.destination?.index)
              )
            );
          } else {
            setValueState(
              cloneWith(valueState, (copyValue: any[]) =>
                reorderList(copyValue, result.source.index, result?.destination?.index)
              )
            );
          }
        }}>
        <DroppableAny droppableId="droppable" direction="horizontal">
          {(provided: any, snapshotContext: any) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={getListStyle(snapshotContext.isDraggingOver)}
              className="ltr">
              {typeFile?.includes('image') && hasCrop ? (
                <CropImageModal aspect={aspect} hasChangeCrop={hasChangeCrop} multiple={multiple}>
                  {Uploader(snapshotContext.isDraggingOver)}
                </CropImageModal>
              ) : (
                Uploader(snapshotContext.isDraggingOver)
              )}
            </div>
          )}
        </DroppableAny>
      </DragDropContextAny>
      {imageHint && (
        <Text mark className="text-xs text-center">
          {t('imageHint', {width: maxWidth, height: maxHeight})}
        </Text>
      )}
      {hint && (
        <Text mark className="text-xs text-center">
          {hint}
        </Text>
      )}
      {typeFile === 'image' && showUploadList && (
        <Image
          className="d-none"
          src={previewImage}
          preview={{
            visible: !isEmpty(previewImage),
            onVisibleChange: () => setPreviewImage(undefined),
            className: 'custom-operation'
          }}
        />
      )}
    </Row>
  );
};

export default memo(CustomUpload);
