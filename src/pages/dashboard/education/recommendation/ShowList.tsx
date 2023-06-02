import React, {useRef, ElementRef, FC} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Button, Card, Space} from 'antd';
import {FormOutlined, FileTextOutlined, FilterOutlined} from '@ant-design/icons';
import {useUser} from 'hooks';
import {SearchRecommendation, RecommendationTable} from 'containers';

const ShowList: FC = () => {
  const {t} = useTranslation('recommendation');
  const {hasPermission} = useUser();
  const searchRef = useRef<ElementRef<typeof SearchRecommendation>>(null);

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <Card
      className="my-6"
      title={t('title')}
      extra={
        <Space size="small">
          {hasPermission('recommendations.store') && (
            <Link to="/education/recommendation/create">
              <Button
                type="primary"
                className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"
                icon={<FormOutlined className="text-lg" />}>
                {t('add_recmnd')}
              </Button>
            </Link>
          )}
          <Link to="/education/recommendation/report">
            <Button type="primary" className="d-text-none md:d-text-unset ant-btn-success" icon={<FileTextOutlined />}>
              {t('report')}
            </Button>
          </Link>
          <Button type="primary" className="d-text-none md:d-text-unset" icon={<FilterOutlined />} onClick={showSearch}>
            {t('filter')}
          </Button>
        </Space>
      }>
      <SearchRecommendation ref={searchRef} />
      <RecommendationTable url="recommendations/paginate" urlName="recommendations" />
    </Card>
  );
};

export default ShowList;
