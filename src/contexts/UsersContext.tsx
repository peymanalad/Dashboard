import React, {useState, SetStateAction, Dispatch, useEffect, FC, createContext} from 'react';
import {userAccessProps} from 'types/user';
import {useHistory} from 'react-router-dom';
import {usePersist} from 'hooks';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

interface IUserCtx {
  users: userAccessProps[];
  setUsers: Dispatch<SetStateAction<userAccessProps[]>>;
}

const UsersContext = createContext<IUserCtx>([] as any); // ignore initial value

export const UsersProvider: FC = ({children}) => {
  const history = useHistory();
  const persist = usePersist();

  const initialUser: userAccessProps[] = [
    {
      is_logged_in: false,
      access_token: '',
      expires_in: 604800,
      refresh_token: '',
      full_name: '',
      id: undefined,
      avatar: ''
    }
  ];
  let initialState: userAccessProps[] = initialUser;
  try {
    initialState = persist.getData('token') != false ? persist.getData('token') : initialUser;
  } catch {
    initialState = initialUser;
  }

  const [users, setUsers] = useState(initialState);

  useEffect(() => {
    const persistToken = persist.getData('token');
    if (!isEqual(get(persistToken, [0]), get(users, [0]))) {
      persist.saveData('token', users);
    }
    if (!users[0]?.access_token && history) {
      history.replace('/');
    }
  }, [users]);

  // export user Provider
  return <UsersContext.Provider value={{users, setUsers}}>{children}</UsersContext.Provider>;
};

export default UsersContext;
