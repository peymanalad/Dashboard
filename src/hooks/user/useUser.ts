import {useContext} from 'react';
import {UsersContext} from 'contexts';
import {useQueryClient} from 'react-query';
import includes from 'lodash/includes';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';
import {first} from 'lodash';

function useUser() {
  const {users, setUsers} = useContext(UsersContext);
  const queryClient = useQueryClient();

  const hasPermission = (permission: string): boolean => {
    const menu: any = queryClient.getQueryData('menu');
    return includes(get(menu, ['data', 'permissions']), permission);
  };

  const getAllPermissions = () => {
    const menu: any = queryClient.getQueryData('menu');
    return get(menu, ['data', 'permissions']);
  };

  const getInfo = () => {
    const menu: any = queryClient.getQueryData('menu');
    return get(menu, ['data']);
  };

  const getId = () => {
    const menu: any = queryClient.getQueryData('menu');
    return get(menu, ['data', 'id']);
  };

  const changeUser = (user_id: any) => {
    const changedUsers = [...users];
    changedUsers.sort((x, y) => {
      return x.id == user_id ? -1 : y.id == user_id ? 1 : 0;
    });
    setUsers(changedUsers);
    queryClient.removeQueries();
  };

  const isMySelf = (id?: number | string) => {
    const menu: any = queryClient.getQueryData('menu');
    return get(menu, ['data', 'id']) === toNumber(id);
  };

  return {...first(users), users, setUsers, hasPermission, getAllPermissions, getInfo, isMySelf, getId, changeUser};
}
export default useUser;
