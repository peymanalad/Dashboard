import React, {FC, Fragment, useState} from 'react';
import {Button, Space, Tooltip, Modal, Typography} from 'antd';
import {
  PictureOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  DiffOutlined,
  ClearOutlined,
  AuditOutlined,
  VideoCameraOutlined,
  SoundOutlined
} from '@ant-design/icons';
import {CustomTable, LinkableListItem} from 'components';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useDelete, useFetch, usePost} from 'hooks';
import includes from 'lodash/includes';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import {convertUtcTimeToLocal} from 'utils';

interface props {
  url: string;
  urlName: string;
}

const {Text} = Typography;

const RecommendationTable: FC<props> = ({url, urlName}) => {
  const {t} = useTranslation('recommendation');

  const [content, setContent] = useState<string | null>();
  const [showNotConfirmed, setShowNotConfirmed] = useState<boolean>();

  const fetchDoctorsNotConfirmed = useFetch({
    url: 'recommendations/{id}/not_confirmed_doctors',
    enabled: false
  });

  const deleteRequest = useDelete({
    url: '/recommendations/{id}',
    name: 'recommendations'
  });

  const copyRecommendation = usePost({
    url: 'recommendations/{id}/copy',
    method: 'POST',
    refetchQueries: ['recommendations'],
    isGeneral: false
  });

  const doctorsEditClear = usePost({
    url: 'recommendations/{id}/doctors_edit',
    method: 'POST',
    refetchQueries: ['recommendations'],
    isGeneral: false
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: t('disease_plan'),
      dataIndex: ['disease', 'name'],
      key: 'disease',
      align: 'center'
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'creator',
      align: 'center',
      render: (date: any) => convertUtcTimeToLocal(date, 'jYYYY/jMM/jDD'),
      responsive: ['sm']
    },
    {
      title: t('subject'),
      dataIndex: ['subject', 'title'],
      key: 'subject',
      align: 'center',
      responsive: ['md']
    },
    {
      title: `${t('status')}`,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      responsive: ['md'],
      render: (text: string) => t(text)
    },
    {
      title: `${t('like')}`,
      dataIndex: 'like',
      key: 'li',
      align: 'center',
      responsive: ['md']
    },
    {
      title: `${t('specifications')}`,
      dataIndex: 'specifications',
      key: 'specifications',
      align: 'center',
      responsive: ['sm'],
      render: (permissions: any, recommendation: any) => (
        <Space size={2}>
          {recommendation?.content && (
            <Tooltip title={t('show_content')}>
              <Button
                type="text"
                icon={<DiffOutlined style={{color: '#625772'}} />}
                onClick={() => {
                  setContent(recommendation.content || '');
                }}
              />
            </Tooltip>
          )}
          {includes(recommendation?.files, 'image') && (
            <Tooltip title={t('has_image')}>
              <PictureOutlined style={{color: '#e95e1e'}} className="p-2" />
            </Tooltip>
          )}
          {includes(recommendation?.files, 'video') && (
            <Tooltip title={t('has_video')}>
              <VideoCameraOutlined style={{color: '#e91e63'}} className="p-2" />
            </Tooltip>
          )}
          {includes(recommendation?.files, 'sound') && (
            <Tooltip title={t('has_sound')}>
              <SoundOutlined style={{color: '#1ecbe9'}} className="p-2" />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: t('actions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: any, recommendation: any) => (
        <Space size={2}>
          {permissions?.update && (
            <Tooltip title={t('edit')}>
              <Link to={`/education/recommendation/edit/${recommendation?.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('delete')}>
              <Button
                onClick={() => deleteRequest?.show(recommendation)}
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
          {permissions?.copy && (
            <Tooltip title={t('copy')}>
              <Button
                type="text"
                icon={<CopyOutlined className="text-primary" />}
                loading={copyRecommendation.isLoading && get(copyRecommendation?.params, 'id') === recommendation?.id}
                onClick={() => {
                  copyRecommendation.post({}, {}, {id: recommendation?.id});
                }}
              />
            </Tooltip>
          )}
          {permissions?.doctors_edit && (
            <Tooltip title={t('doctors_edit_clean')}>
              <Button
                type="text"
                icon={<ClearOutlined style={{color: '#7D5A50'}} />}
                loading={doctorsEditClear?.isLoading && get(doctorsEditClear?.params, 'id') === recommendation?.id}
                onClick={() => {
                  doctorsEditClear.post({}, {}, {id: recommendation?.id});
                }}
              />
            </Tooltip>
          )}
          {permissions?.doctors_not_confirm && (
            <Tooltip title={t('doctors_not_confirm')}>
              <Button
                type="text"
                icon={<AuditOutlined style={{color: '#ff7f50'}} />}
                onClick={() => {
                  fetchDoctorsNotConfirmed.fetch({id: recommendation?.id});
                  setShowNotConfirmed(true);
                }}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Fragment>
      <Modal
        title={t('content')}
        visible={!isNil(content)}
        onCancel={() => {
          setContent(null);
        }}
        footer={null}>
        <Text>{content}</Text>
      </Modal>
      <Modal
        title={t('doctors_not_confirm')}
        visible={showNotConfirmed}
        onCancel={() => {
          setShowNotConfirmed(false);
        }}
        footer={null}>
        <LinkableListItem
          list={fetchDoctorsNotConfirmed?.data}
          title="sasa"
          url="sasa"
          label={['full_name', 'username']}
          loading={fetchDoctorsNotConfirmed?.isFetching}
          showInCard={false}
        />
      </Modal>
      <CustomTable fetch={url} dataName={urlName} columns={columns} />
    </Fragment>
  );
};
export default RecommendationTable;
