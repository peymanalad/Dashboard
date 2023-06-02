import debounce from 'lodash/debounce';
import entries from 'lodash/entries';
import forEach from 'lodash/forEach';
import endsWith from 'lodash/endsWith';
import replace from 'lodash/replace';
import set from 'lodash/set';
import {Modal} from 'antd';
import {i18n} from 'libs';

export const saveStorageForm = debounce((key: string, allFields: any) => {
  localStorage.setItem(key, JSON.stringify(allFields));
}, 500);

export const getStorageForm = (key: string): Promise<any> =>
  new Promise((resolve, reject) => {
    const storageData = localStorage.getItem(key);
    let storageDataParsed = {};
    if (storageData != null) {
      storageDataParsed = JSON.parse(storageData);
    }
    if (storageData) {
      Modal.destroyAll();
      Modal.confirm({
        title: i18n.t('general:cache'),
        content: i18n.t('general:useCacheForThisForm'),
        direction: 'rtl',
        okText: i18n.t('general:yes'),
        cancelText: i18n.t('general:no'),
        onOk: () => {
          forEach(entries(storageDataParsed), ([key, value]) => {
            if (endsWith(key, '_id')) {
              set(storageDataParsed, replace(key, '_id', ''), value);
            }
          });
          resolve(storageDataParsed);
        },
        onCancel: () => {
          localStorage.removeItem(key);
          reject();
        }
      });
    } else reject();
  });

export const saveToStorage = (name: string, data: any) => {
  localStorage.setItem(name, encodeURIComponent(JSON.stringify(data)));
};

export const getFromStorage = (name: string): any => {
  return localStorage.getItem(name) !== null && JSON.parse(decodeURIComponent(localStorage.getItem(name) || '') || '');
};

export const deleteFromStorage = (name: string) => {
  localStorage.removeItem(name);
};
