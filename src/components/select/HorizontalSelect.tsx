import React from 'react';
import {Input, Tag, Spin, Col, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useInfinite} from 'hooks';
import debounce from 'lodash/debounce';
import map from 'lodash/map';
import {InView} from 'react-intersection-observer';

interface horizontalSelect {
  url: string;
  urlName: string;
  isGeneral: boolean;
  selectTag?: (item: {name: string; id: number}) => void;
  params?: any;
}

const HorizontalSelect = ({url, urlName, isGeneral, selectTag, params}: horizontalSelect) => {
  const {t} = useTranslation('general');

  const fetchHorizontalData = useInfinite({
    url,
    name: urlName,
    isGeneral,
    enabled: false,
    params
  });

  const debounced = debounce((search: string) => {
    fetchHorizontalData.fetch({}, {search});
  }, 500);

  return (
    <Row gutter={[16, 8]} className="w-full" style={{marginBottom: 0}}>
      <Col span={12} style={{paddingLeft: 0, paddingBottom: 0}}>
        <Input
          placeholder={t('search_tag')}
          onChange={(event) => {
            debounced(event.target.value);
          }}
        />
      </Col>
      <Col span={12}>
        <Row className="horizontal-scroll-container">
          {map(fetchHorizontalData?.data, (item: any) => (
            <Tag
              key={item?.id}
              color="cyan"
              className="mx-1 px-3 py-1"
              onClick={() => {
                if (selectTag) {
                  selectTag(item);
                }
              }}>
              {item?.name}
            </Tag>
          ))}
          {fetchHorizontalData.hasNextPage && (
            // @ts-ignore
            <InView as="div" onChange={(inView) => inView && fetchHorizontalData.fetchNextPage()}>
              <Spin size="small" className="flex-center" />
            </InView>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default HorizontalSelect;
