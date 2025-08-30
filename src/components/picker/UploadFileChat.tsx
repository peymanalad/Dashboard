import React, {CSSProperties, FC} from 'react';
import {Upload, message, Button} from 'antd';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {PaperClipOutlined} from '@ant-design/icons';
import useUser from 'hooks/user/useUser';
import first from 'lodash/first';
import {windowProcess} from 'utils/process';
import type {ChatType} from 'types/message';
import type {UploadAdvancedInputType} from 'types/file';

export interface props {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  uploadType: UploadAdvancedInputType;
  sendFile: (file: File) => void;
  ErrorFile: () => void;
  sendPath: (path: string, type: ChatType, file: File) => void;
}

const ShowImages: FC<props> = ({className, style, sendFile, sendPath, disabled, uploadType, ErrorFile}) => {
  const {t} = useTranslation('recommendation');
  const user = useUser();

  const headers = {
    Authorization: `Bearer ${user?.access_token}`,
    'content-type': 'multipart/form-data'
  };

  const customRequest = async (files: any) => {
    const {onSuccess, onError} = files;

    const formData = new FormData();
    // formData.append('type', uploadType);
    formData.append('file', files.file);
    // formData.append('user_id', toString(user.getId()));

    const config = {
      headers: files.headers,
      onUploadProgress: (event: any) => {
        if (files?.onProgress) files.onProgress({percent: (event.loaded / event.total) * 100});
      }
    };
    sendFile(files?.file);
    try {
      const res = await axios.post(files.action, formData, config);
      onSuccess('Ok');
      if (res?.status === 200) {
        message.success(`${t('file_uploaded_successfully')}`);
        sendPath(res?.data?.result?.id, first(files?.file?.type?.split('/')) || 'image', files?.file);
      } else message.error(`${t('file_upload_failed')}`);
    } catch (err) {
      message.error(`${t('file_upload_failed')}`);
      onError({err});
      ErrorFile();
    }
  };

  return (
    <Upload
      className={className}
      style={style}
      accept={'image/*,audio/*,video/*'}
      action={`${windowProcess('REACT_APP_BASE_URL')}/Chat/UploadFile`}
      headers={headers}
      showUploadList={false}
      method="POST"
      disabled={disabled}
      customRequest={(file: any) => customRequest(file)}>
      <Button
        type="text"
        disabled={disabled}
        icon={<PaperClipOutlined style={{color: 'rgba(0,0,0,.45)', fontSize: 18}} />}
      />
    </Upload>
  );
};

export default ShowImages;
