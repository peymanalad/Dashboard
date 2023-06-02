import first from 'lodash/first';
import entries from 'lodash/entries';
import map from 'lodash/map';
import split from 'lodash/split';
import keys from 'lodash/keys';
import get from 'lodash/get';
import {AxiosError} from 'axios';

interface Props {
  form?: any;
}

const useError = (props?: Props) => {
  const handle = (failureCount: number, error: AxiosError): boolean => {
    if (props?.form && error?.response?.status === 422) {
      try {
        props.form.setFields(
          map(entries(get(error?.response?.data, 'data')), ([name, errors]) => ({
            name: split(name, '.'),
            errors
          }))
        );
        props.form.scrollToField(split(first(keys(get(error?.response?.data, 'data'))), '.'), {behavior: 'smooth'});
      } catch (e) {
        console.error(e);
      }
    }
    if (error?.response?.status === 404 || error?.response?.status === 500) return false;
    return failureCount <= 1;
  };

  return {handle};
};

export default useError;
