import {useContext} from 'react';
import {UsersContext} from 'context';
import {useQueryClient} from 'react-query';
import {usePost} from 'hooks';
import {useHistory} from 'react-router-dom';

function useLogOut() {
  const {setUser} = useContext(UsersContext);
  const queryClient = useQueryClient();
  const history = useHistory();

  const logOutRequest = usePost({
    url: 'users/logout',
    isGeneral: true,
    method: 'POST',
    onSuccess: () => {
      setUser({is_logged_in: false});
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
