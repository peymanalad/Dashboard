import React, {FC} from 'react';
import {i18n} from 'libs';

const MaintenanceSpinner: FC = () => {
  return (
    <div className="h-screen w-screen bg-grayLight">
      <div className="h-full w-full d-flex flex-col justify-center items-center">
        <div className="maintenance-spinner">
          <div className="bar1" />
          <div className="bar2" />
          <div className="bar3" />
          <div className="bar4" />
          <div className="bar5" />
          <div className="bar6" />
          <div className="bar7" />
          <div className="bar8" />
          <div className="bar9" />
          <div className="bar10" />
          <div className="bar11" />
          <div className="bar12" />
        </div>
        <p className="py-5 px-5 text-center font-bold text-lg">{i18n.t('error:checkNewVersion')}</p>
      </div>
    </div>
  );
};

export default MaintenanceSpinner;
