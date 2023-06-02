import React, {FC} from 'react';
import {CheckedIcon, ParkingIcon, ThinkingIcon, MinusIcon, CloseIcon, PlusIcon} from 'assets';
import {useTranslation} from 'react-i18next';

interface props {
  confirm: number;
  not_confirm: number;
  not_checked: number;
  edit: number;
  total_visits: number;
  total_patients: number;
}
const TopCart: FC<props> = ({confirm, not_confirm, not_checked, edit, total_visits, total_patients}) => {
  const {t} = useTranslation('dr_report');
  return (
    <>
      <div className="mb-6 flex flex-row w-full">
        <div className="shadow-lg h-32 mx-3 w-2/6 bg-white flex items-center p-6 rounded border-solid border-grayLight border-1">
          <CheckedIcon className="text-white" style={{fontSize: '5rem'}} />
          <div className="flex flex-col h-full w-4/5">
            <h1 className="text-center text-3xl text-active">{confirm}</h1>
            <p className="text-center">{t('confirm')}</p>
          </div>
        </div>
        <div className="shadow-lg h-32 mx-3 w-2/6 bg-white flex items-center p-6 rounded border-solid border-grayLight border-1">
          <CloseIcon style={{fontSize: '5rem'}} />
          <div className="flex flex-col h-full w-4/5">
            <h1 className="text-center text-3xl text-active">{not_confirm}</h1>
            <p className="text-center">{t('notconfirm')}</p>
          </div>
        </div>
        <div className="shadow-lg h-32 mx-3 w-2/6 bg-white flex items-center p-6 rounded border-solid border-grayLight border-1">
          <MinusIcon style={{fontSize: '5rem'}} />
          <div className="flex flex-col  h-full w-4/5">
            <h1 className="text-center text-3xl text-active">{not_checked}</h1>
            <p className="text-center">{t('notchecked')}</p>
          </div>
        </div>
      </div>
      <div className="mb-6 flex flex-row w-full">
        <div className="shadow-lg h-32 mx-3 w-2/6 bg-white flex items-center p-6 rounded border-solid border-grayLight border-1">
          <ThinkingIcon style={{fontSize: '5rem'}} />
          <div className="flex flex-col h-full w-4/5">
            <h1 className="text-center text-3xl text-active">{edit}</h1>
            <p className="text-center">{t('edit')}</p>
          </div>
        </div>
        <div className="shadow-lg h-32 mx-3 w-2/6 bg-white flex items-center p-6 rounded border-solid border-grayLight border-1">
          <PlusIcon style={{fontSize: '5rem'}} />
          <div className="flex flex-col   h-full w-4/5">
            <h1 className="text-center text-3xl text-active">{total_visits}</h1>
            <p className="text-center">{t('total_visits')}</p>
          </div>
        </div>
        <div className="shadow-lg h-32 mx-3 w-2/6 bg-white flex items-center p-6 rounded border-solid border-grayLight border-1">
          <ParkingIcon style={{fontSize: '5rem'}} />
          <div className="flex flex-col   h-full w-4/5">
            <h1 className="text-center text-3xl text-active">{total_patients}</h1>
            <p className="text-center">{t('total_patients')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopCart;
