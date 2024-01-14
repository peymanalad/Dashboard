import React, {ForwardedRef, forwardRef, ForwardRefRenderFunction, RefObject, useMemo, useRef, useState} from 'react';
import {Button, Col, Modal, Row, Slider, UploadProps} from 'antd';
import type CropperProps from 'cropperjs';
import {Cropper} from 'react-cropper';
import type {RcFile} from 'antd/lib/upload';
import {useTranslation} from 'react-i18next';

interface refProps {
  open: () => void;
  close: () => void;
}

export interface props {
  ref?: RefObject<refProps>;
  hasChangeCrop?: boolean;
  aspect?: number;
  onModalOk?: any;
  children: any;
  onModalCancel?: any;
  beforeCrop?: any;
  onUploadFail?: any;
}

const CropImageModal: ForwardRefRenderFunction<refProps, props> = (
  {onModalOk, onModalCancel, beforeCrop, onUploadFail, aspect, children, hasChangeCrop = false}: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const beforeUploadRef = useRef<UploadProps['beforeUpload']>();
  const resolveRef = useRef<any>();
  const rejectRef = useRef<(err: Error) => void>();
  const fileRef = useRef<RcFile>();
  const cb = useRef<Pick<refProps, any>>({});
  cb.current.onModalOk = onModalOk;
  cb.current.onModalCancel = onModalCancel;
  cb.current.beforeCrop = beforeCrop;
  cb.current.onUploadFail = onUploadFail;

  const [image, setImage] = useState<string | undefined>(undefined);
  const [rotate, setRotate] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(0);
  const [cropper, setCropper] = useState<CropperProps>();
  const {t} = useTranslation('general');

  const onCropImage = async () => {
    if (cropper) {
      const blob = await (await fetch(cropper.getCroppedCanvas().toDataURL())).blob();
      const newImageFile = new File([blob], 'fileName.jpg', {type: 'image/png'});
      setImage(undefined);
      return resolveRef.current(newImageFile);
    }
  };

  const uploadComponent = useMemo(() => {
    const upload = Array.isArray(children) ? children[0] : children;
    const {beforeUpload, accept, ...restUploadProps} = upload.props;
    beforeUploadRef.current = beforeUpload;

    return {
      ...upload,
      props: {
        ...restUploadProps,
        accept: accept || 'image/*',
        beforeUpload: (file: any, fileList: any) => {
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (resolve, reject) => {
            if (cb.current.beforeCrop) {
              const shouldCrop = await cb.current.beforeCrop(file, fileList);
              // eslint-disable-next-line no-promise-executor-return
              if (!shouldCrop) return reject();
            }
            if (!file.type?.includes('image')) {
              resolve(file);
              return;
            }

            fileRef.current = file;
            resolveRef.current = (newFile: any) => {
              cb.current.onModalOk?.(newFile);
              resolve(newFile);
            };
            rejectRef.current = (uploadErr) => {
              cb.current.onUploadFail?.(uploadErr);
              reject();
            };

            const reader = new FileReader();
            reader.addEventListener('load', () => {
              if (typeof reader.result === 'string') {
                setImage(reader.result);
              }
            });
            reader.readAsDataURL(file);
          });
        }
      }
    };
  }, [children]);

  const onRotate = (value: number) => {
    cropper?.rotateTo(value);
    setRotate(value);
  };

  const onReduceRotate = () => onRotate(rotate - 1);
  const onIncreaseRotate = () => onRotate(rotate + 1);

  const onZoom = (value: number) => {
    cropper?.zoomTo(value);
    setZoom(value);
  };

  const onReduceZoom = () => onZoom(zoom - 1);
  const onIncreaseZoom = () => onZoom(zoom + 1);
  const onReset = () => {
    if (aspect) cropper?.setAspectRatio(aspect);
  };

  return (
    <>
      {uploadComponent}
      <Modal
        visible={!!image}
        centered
        destroyOnClose
        title={t('cropImage')}
        onOk={onCropImage}
        maskClosable={false}
        onCancel={() => {
          setImage(undefined);
        }}>
        <Cropper
          style={{height: '100%', width: '100%'}}
          src={image}
          dragMode="move"
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive
          autoCropArea={1}
          checkOrientation={false}
          initialAspectRatio={aspect}
          cropBoxResizable={hasChangeCrop}
          onInitialized={setCropper}
          guides={false}
        />
        <Row gutter={[16, 32]} className="mt-2">
          <Col span={24} className="flex flex-row">
            <Button onClick={onReduceRotate}>↻</Button>
            <Slider min={-180} max={180} step={1} value={rotate} onChange={onRotate} className="flex-1 mx-4" />
            <Button onClick={onIncreaseRotate}>↺</Button>
          </Col>
          <Col span={24} className="flex flex-row">
            <Button onClick={onReduceZoom}>-</Button>
            <Slider min={0} max={3} step={0.3} value={zoom} onChange={onZoom} className="flex-1 mx-4" />
            <Button onClick={onIncreaseZoom}>+</Button>
          </Col>
          {hasChangeCrop && (
            <Col span={24} className="flex flex-center">
              <Button onClick={onReset}>{t('resetAspectRatio')}</Button>
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};

export default forwardRef(CropImageModal);
