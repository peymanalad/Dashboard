import React, {useState, SetStateAction, Dispatch, useEffect, FC, createContext} from 'react';
import {userAccessProps} from 'types/user';
import {useHistory} from 'react-router-dom';
import {usePersist} from 'hooks';
import isEqual from 'lodash/isEqual';

interface IUserCtx {
  user: userAccessProps;
  setUser: Dispatch<SetStateAction<userAccessProps>>;
}

const UsersContext = createContext<IUserCtx>([] as any); // ignore initial value

export const UsersProvider: FC = ({children}) => {
  const history = useHistory();
  const persist = usePersist();

  const initialUser: userAccessProps = {
    is_logged_in: false,
    access_token: '',
    expires_in: 604800,
    refresh_token: '',
    full_name: '',
    id: undefined,
    avatar: ''
  };
  let initialState: userAccessProps = initialUser;
  try {
    initialState = persist.getData('token') != false ? persist.getData('token') : initialUser;
  } catch {
    initialState = initialUser;
  }

  const [user, setUser] = useState(initialState);

  useEffect(() => {
    const persistToken = persist.getData('token');
    if (!isEqual(persistToken, user)) {
      persist.saveData('token', user);
    }
    if (!user?.access_token && history) {
      history.replace('/');
    }
  }, [user]);

  // export user Provider
  return <UsersContext.Provider value={{user, setUser}}>{children}</UsersContext.Provider>;
};

export default UsersContext;
