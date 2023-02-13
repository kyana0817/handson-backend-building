import { useContext, useReducer, createContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { currentUser } from '../lib/auth';
import storage from './storage';


const AuthenticationContext = createContext(undefined);

const initialState = {
  logged: undefined
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'logout':
      storage.clear()
      return {
        ...state,
        logged: false
      }
    case 'login':
      return {
        ...state,
        logged: true
      }
    default:
      throw new Error('reducer undefined action type')
  }
}

export const AuthenticationProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const user = await currentUser();
      if (user) {
        dispatch({type: 'login'})
      } else {
        dispatch({type: 'logout'})
      }
    })();
  }, [])

  return (
    <AuthenticationContext.Provider value={{state, dispatch}}>
      {children}
    </AuthenticationContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  return context
}

export const useAuthorization = () => {
  const { state } = useAuth();

  return {logged: state.logged, loading: state.logged === undefined};
}


const ForbiddenComponent = () => {
  const { logged, loading } = useAuthorization();

  return (
    <>
      {
        loading
          ? <p>loading......</p>
          : !logged && <Navigate to="/auth"/>
      }
    </>
  )
}

export const Authoraization = ({children}) => {
  const { logged } = useAuthorization();
  return (
    <>
      {
        logged
        ? children
        : <ForbiddenComponent />
      }
    </>
  )
}
