import {useContext} from 'react';
import {UsersContext} from 'context';
import {useQueryClient} from 'react-query';
import includes from 'lodash/includes';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';

function useUser() {
  const {user, setUser} = useContext(UsersContext);
  const queryClient = useQueryClient();

  const hasPermission = (permission: string): boolean => {
    const menu: any = queryClient.getQueryData('profile');
    return includes(get(menu, ['data', 'permissions']), permission);
  };

  const getAllPermissions = () => {
    const menu: any = queryClient.getQueryData('profile');
    return get(menu, ['data', 'permissions']);
  };

  const getAllOrganizations = () => {
    const menu: any = queryClient.getQueryData('profile');
    if (menu?.data?.user?.isSuperUser) return null;
    return get(menu, ['data', 'joinedOrganizations']);
  };

  const getInfo = () => {
    const profile: any = queryClient.getQueryData('profile');
    return get(profile, ['data', 'user']);
  };

  const isSuperUser = () => getInfo()?.isSuperUser;

  const getId = () => {
    const profile: any = queryClient.getQueryData('profile');
    return get(profile, ['data', 'user', 'id']);
  };

  const isMySelf = (id?: number | string) => {
    const menu: any = queryClient.getQueryData('profile');
    return get(menu, ['data', 'user', 'id']) === toNumber(id);
  };

  return {
    ...user,
    setUser,
    isSuperUser,
    hasPermission,
    getAllPermissions,
    getInfo,
    isMySelf,
    getId,
    getAllOrganizations
  };
}
export default useUser;
