import {useContext} from 'react';
import {UsersContext} from 'contexts';
import {useQueryClient} from 'react-query';
import {usePost} from 'hooks';
import {useHistory} from 'react-router-dom';

function useLogOut() {
  const {users, setUsers} = useContext(UsersContext);
  const queryClient = useQueryClient();
  const history = useHistory();

  const logOutRequest = usePost({
    url: 'users/logout',
    isGeneral: true,
    method: 'POST',
    onSuccess: () => {
      const currentUsers = [...users];
      currentUsers.shift();
      setUsers(currentUsers);
      history.replace('/');
      queryClient.removeQueries();
    }
  });

  const logOut = () => {
    logOutRequest.post({platform: 'web', model: navigator.userAgent});
  };

  return {logOut, isLoading: logOutRequest.isLoading};
}
export default useLogOut;
