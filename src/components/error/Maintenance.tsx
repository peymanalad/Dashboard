import React, {FC} from 'react';
import {maintenanceImg} from 'assets';
import {i18n} from 'libs';

const Maintenance: FC = () => {
  return (
    <div className="h-screen w-screen bg-grayLight">
      <div className="h-full w-full d-flex flex-col justify-center items-center">
        <img src={maintenanceImg} style={{maxWidth: 500}} alt="errorImage" />
        <p className="py-5 px-5 text-center font-bold text-lg">{i18n.t('error:maintenance')}</p>
        <p className="text-center px-5 text-gray">{i18n.t('error:weAreFixingProblems')}</p>
      </div>
    </div>
  );
};

export default Maintenance;
