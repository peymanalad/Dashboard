import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Tabs} from 'antd';
import {useParams} from 'react-router-dom';
import {VisitBasicInfo, VisitQuestion, VisitCare, VisitPictures, VisitDailyReport} from 'containers';

const {TabPane} = Tabs;

const EditVisit: FC = () => {
  const {t} = useTranslation('visit');
  const {id} = useParams<{id?: string}>();

  return (
    <Tabs type="line" size="small" className="overflow-visible">
      <TabPane tab={t('create.basic-info')} key="basic">
        <VisitBasicInfo id={id} />
      </TabPane>
      <TabPane tab={t('create.schem-care')} key="care">
        <VisitCare id={id} />
      </TabPane>
      <TabPane tab={t('create.question')} key="question">
        <VisitQuestion id={id} />
      </TabPane>
      <TabPane tab={t('create.pictures')} key="picture">
        <VisitPictures id={id} />
      </TabPane>
      <TabPane tab={t('create.daily_report')} key="report">
        <VisitDailyReport id={id} />
      </TabPane>
    </Tabs>
  );
};

export default EditVisit;
