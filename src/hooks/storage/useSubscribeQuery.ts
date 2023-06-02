import {useQuery} from 'react-query';
import {SubscribeDataProps} from 'types/general';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import get from 'lodash/get';

interface Props {
  name: Array<string | number | undefined | null> | string;
  subscribesDataSet: SubscribeDataProps[];
}

const useSubscribeQuery = ({name, subscribesDataSet}: Props) => {
  const query = useQuery(name);

  const valueSubscribeDataSet = {};
  forEach(subscribesDataSet, (subscribeData: SubscribeDataProps) => {
    set(valueSubscribeDataSet, subscribeData.key, get(query, subscribeData.path));
  });

  return valueSubscribeDataSet;
};

export default useSubscribeQuery;
