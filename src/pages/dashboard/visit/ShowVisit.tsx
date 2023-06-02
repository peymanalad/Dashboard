import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Tabs} from 'antd';
import {useParams} from 'react-router-dom';
import {ShowVisitBasicInfo, ShowVisitQuestion, ShowVisitCare, ShowVisitDrug, ShowVisitPictures} from 'containers';

const {TabPane} = Tabs;

const ShowVisit: FC = () => {
  const {t} = useTranslation('visit');
  const {id} = useParams<{id?: string}>();

  return (
    <Tabs type="line" size="small" className="overflow-visible">
      <TabPane tab={t('create.basic-info')} key="basic">
        <ShowVisitBasicInfo id={id} />
      </TabPane>
      <TabPane tab={t('create.schem-care')} key="care">
        <ShowVisitCare id={id} />
      </TabPane>
      <TabPane tab={t('create.question')} key="question">
        <ShowVisitQuestion id={id} />
      </TabPane>
      <TabPane tab={t('create.current_drug')} key="drug">
        <ShowVisitDrug id={id} />
      </TabPane>
      <TabPane tab={t('create.pictures')} key="picture">
        <ShowVisitPictures id={id} />
      </TabPane>
    </Tabs>
  );
};

export default ShowVisit;
