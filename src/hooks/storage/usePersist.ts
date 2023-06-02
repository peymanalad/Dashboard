import {Persistor, persistQueryClient} from 'react-query/persistQueryClient-experimental';
import {createWebStoragePersistor} from 'react-query/createWebStoragePersistor-experimental';
import {QueryClient} from 'react-query/core';
import {saveToStorage, getFromStorage, deleteFromStorage} from 'utils';

const usePersist = () => {
  const localStoragePersistor: Persistor = createWebStoragePersistor({storage: window.localStorage});

  const saveQuery = (queryClient: QueryClient) => {
    persistQueryClient({
      queryClient,
      persistor: localStoragePersistor
    });
  };

  return {saveQuery, saveData: saveToStorage, getData: getFromStorage, deleteData: deleteFromStorage};
};

export default usePersist;
