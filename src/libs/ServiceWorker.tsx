import React, {useEffect, FC} from 'react';
import * as serviceWorker from 'serviceWorker';
import {ConfigProvider, Modal, notification} from 'antd';
import {useTranslation} from 'react-i18next';
import frIR from 'antd/lib/locale/fa_IR';
import map from 'lodash/map';

const ServiceWorker: FC = () => {
  const {t} = useTranslation('general');

  const [showReload, setShowReload] = React.useState(false);
  const [waitingWorker, setWaitingWorker] = React.useState<ServiceWorker | null>(null);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  const onSWSuccess = () => {
    localStorage.removeItem('updated');
    notification.success({
      duration: 2,
      placement: 'topLeft',
      message: t('messages.updated')
    });
    caches.keys().then((cacheNames) => {
      return Promise.all(
        map(cacheNames, (cacheName) => {
          return caches.delete(cacheName);
        })
      );
    });
  };

  useEffect(() => {
    if (localStorage.getItem('updated')) onSWSuccess();
    serviceWorker.register({
      onUpdate: onSWUpdate
    });
  }, []);

  const reloadPage = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({type: 'SKIP_WAITING'});
      setShowReload(false);
      window.location.reload();
    }
  };

  return (
    <ConfigProvider direction="rtl" locale={frIR}>
      <Modal
        title={t('update')}
        visible={showReload}
        okText={t('update')}
        onOk={() => {
          localStorage.setItem('updated', 'true');
          reloadPage();
        }}
        onCancel={() => {
          setShowReload(false);
        }}>
        <p>{t('messages.updateAvailable')}</p>
      </Modal>
    </ConfigProvider>
  );
};

export default ServiceWorker;
