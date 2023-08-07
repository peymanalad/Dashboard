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
    url: 'TokenAuth/LogOut',
    isGeneral: true,
    method: 'GET',
    onSuccess: () => {
      setUser({is_logged_in: false});
      history.replace('/');
      queryClient.removeQueries();
    }
  });

  const logOut = () => {
    logOutRequest.post();
  };

  return {logOut, isLoading: logOutRequest.isLoading};
}
export default useLogOut;
