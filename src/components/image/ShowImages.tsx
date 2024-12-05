import React, {useState, useEffect, CSSProperties} from 'react';
import {Upload, Modal, message} from 'antd';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {ImagesDataShow, ImageDataUpload} from 'types/image';
import useUser from 'hooks/user/useUser';
import map from 'lodash/map';

export interface props {
  data: ImagesDataShow[];
  className?: string;
  style?: CSSProperties;
  defaultImageName?: string;
  listType: 'picture-card' | 'picture';
  removedImage?: (items: any) => void;
  disabled?: boolean;
}

const ShowImages = ({data, className, style, listType, defaultImageName, removedImage, disabled}: props) => {
  // states
  const {access_token} = useUser();
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const {t} = useTranslation('general');

  useEffect(() => {
    const ImageList: ImageDataUpload[] = [];
    map(data, (image, index) => {
      ImageList.push({
        uid: `${index}`,
        name: image.name ? image.name : `${defaultImageName} ${index + 1}`,
        url: image.path,
        path: image.imagePath
      });
    });
    setFileList(ImageList);
  }, [data]);

  const getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const onRemove = (name: any) => {
    const path = fileList?.find((e: any) => name?.uid === e?.uid)?.path;
    const formData = new URLSearchParams();
    formData.append('path', path);
    const options: any = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: formData,
      url: 'https://mobinn.ir/general/v1/files/delete'
    };
    return new Promise<boolean>((resolve, reject) => {
      Modal.confirm({
        title: `${t('delete_title')}`,
        style: {direction: 'rtl'},
        content: `${t('file_delete_continue')}`,
        onOk: () => {
          axios(options)
            .then(() => {
              message.success(`${t('file_delete_successfully')}`);
              resolve(true);
              if (removedImage) {
                removedImage(fileList?.filter((_: any) => _?.path !== path));
              }
            })
            .catch(() => {
              message.success(`${t('file_delete_successfully')}`);
              if (removedImage) {
                removedImage(fileList?.filter((_: any) => _?.path !== path));
              }
            });
        },
        okText: `${t('delete')}`,
        cancelText: `${t('cancel')}`
      });
    });
  };

  return (
    <>
      <Upload
        fileList={fileList}
        className={className}
        style={style}
        disabled={disabled}
        onPreview={handlePreview}
        onRemove={onRemove}
        listType={listType}
      />
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%', height: '100%'}} src={previewImage} />
      </Modal>
    </>
  );
};

export default ShowImages;
