import React, {FC, ReactNode} from 'react';
import {Typography, Row, Col, Card, Space, Spin} from 'antd';
import {allocateParamToString, renderLabel} from 'utils';
import {Link} from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import {EmptyList} from 'assets';
import {useTranslation} from 'react-i18next';
import map from 'lodash/map';
import split from 'lodash/split';
import {isFunction} from 'lodash';

interface Props {
  list: Array<any>;
  title: string;
  url: string;
  label: string | string[][] | string[];
  value?: string | string[][] | string[];
  showInCard?: boolean;
  loading?: boolean;
  wrapper?: boolean;
  wrapperContent?: ReactNode;
  valueConvertor?: (value: any) => any;
}

const LinkableListItem: FC<Props> = ({
  list,
  title,
  loading = false,
  showInCard = true,
  wrapper,
  wrapperContent,
  url,
  label = 'name',
  value = 'value',
  valueConvertor
}) => {
  const {Text} = Typography;
  const {t} = useTranslation('general');

  const renderContent = () => {
    if (loading)
      return (
        <Row className="h-full flex-center">
          <Spin />
        </Row>
      );
    return (
      <>
        {isEmpty(list) ? (
          <Row className="flex justify-center">
            <Space align="center" direction="vertical">
              <EmptyList />
              <Text type="secondary">{t('empty')}</Text>
            </Space>
          </Row>
        ) : (
          map(list, (item: any, index: number) => (
            <Link to={allocateParamToString(url, item)} key={index}>
              <Row className="w-full p-2 cursor-pointer m-0">
                <Col span={12} className="text-center">
                  <Text className="inline-block w-full text-md">{renderLabel(item, label)}</Text>
                </Col>
                <Col span={12} className="text-center">
                  <Text type="secondary" className="inline-block w-full text-md">
                    {isFunction(valueConvertor) ? valueConvertor(renderLabel(item, value)) : renderLabel(item, value)}
                  </Text>
                </Col>
              </Row>
            </Link>
          ))
        )}
      </>
    );
  };

  if (showInCard)
    return (
      <Card
        title={title}
        className={`rounded-lg shadow-lg h-300-px ${wrapper ? 'relative' : 'card-scroll'}`}
        bodyStyle={{padding: '0.5rem'}}>
        {renderContent()}
        {wrapper && (
          <Col className="absolute h-8 rounded flex-center text-white w-full h-full l-0 bottom-0 glass-morphism">
            {wrapperContent}
          </Col>
        )}
      </Card>
    );
  return renderContent();
};

export default LinkableListItem;
