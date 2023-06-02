import React from 'react';
import ServerErrorIcon from 'assets/svg/ServerError';
import {i18n} from 'libs';

interface props {
  onTry: () => void;
}

const ServerError = ({onTry}: props) => (
  <button type="button" style={{cursor: 'pointer'}} onClick={onTry} className="flex-center flex-col">
    <ServerErrorIcon />
    <p className="text-blueError text-bold py-1">{i18n.t('general:request_failed_try_again')}</p>
  </button>
);
export default ServerError;
