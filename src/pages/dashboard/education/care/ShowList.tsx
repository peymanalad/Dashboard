import React, {FC, ElementRef, useRef} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {
  FormOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PictureOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {SearchCareList} from 'containers';
import {Link} from 'react-router-dom';
import {CustomTable} from 'components';
import {useDelete, useUser} from 'hooks';
import qs from 'qs';

const ShowList: FC = () => {
  const {t} = useTranslation('care');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof SearchCareList>>(null);

  const deleteRequest = useDelete({
    url: '/diseases/{id}',
    name: 'diseases'
  });

  const columns: any = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: t('parentDisease'),
      dataIndex: ['parent', 'name'],
      key: 'parent',
      align: 'center'
    },
    {
      title: 'ICD',
      dataIndex: 'icd',
      key: 'icd',
      align: 'center',
      responsive: ['md'],
      render: (value: string) => value || '-'
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      responsive: ['sm'],
      render: (value: string) => t(value)
    },
    {
      title: t('specifications'),
      dataIndex: 'is_confirm',
      key: 'is_confirm',
      align: 'center',
      responsive: ['md'],
      render: (value: boolean, disease: any) => (
        <Space size={15}>
          <Tooltip title={t(value ? 'active.true' : 'active.false')}>
            {value ? (
              <CheckCircleOutlined style={{color: '#4CAF50', fontSize: 18}} />
            ) : (
              <CloseCircleOutlined style={{color: '#F44336', fontSize: 18}} />
            )}
          </Tooltip>
          {disease?.has_picture && (
            <Tooltip title={t('has_image')}>
              <PictureOutlined style={{color: 'gray', fontSize: 18}} />
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
      render: (permissions: any, disease: any) => (
        <Space size={2}>
          {permissions?.questions && (
            <Tooltip title={t('go_questions')}>
              <Link to={`/question/question/list?${qs.stringify({diseases: [disease], diseases_id: [disease?.id]})}`}>
                <Button type="text" icon={<QuestionCircleOutlined style={{color: '#0a8cac'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.view && (
            <Tooltip title={t('show')}>
              <Link to={`/education/care/show/${disease?.id}`}>
                <Button type="text" icon={<EyeOutlined style={{color: '#f6830f'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.update && (
            <Tooltip title={t('update')}>
              <Link to={`/education/care/edit/${disease.id}`}>
                <Button type="text" icon={<EditOutlined style={{color: '#035aa6'}} />} />
              </Link>
            </Tooltip>
          )}
          {permissions?.delete && (
            <Tooltip title={t('do_delete')}>
              <Button
                onClick={() => deleteRequest.show(disease)}
                type="text"
                icon={<DeleteOutlined style={{color: 'red'}} />}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      className="my-6"
      title={t('title')}
      extra={
        <Space size="small">
          {hasPermission('diseases.store') && (
            <Link to="/education/care/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined />}>
                {t('add_care')}
              </Button>
            </Link>
          )}
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchCareList ref={searchRef} />
      <CustomTable
        fetch="diseases/paginate"
        rowClassName={(record: any) => `bg-${record?.is_confirm ? 'active' : 'inactive'}`}
        dataName="diseases"
        columns={columns}
      />
    </Card>
  );
};

export default ShowList;
