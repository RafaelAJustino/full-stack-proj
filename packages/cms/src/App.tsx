import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/Molecules/NavBar';
import PrivateRoute from './components/Atoms/PrivateRoutes/privateRoute';
import Home from '../src/components/Templates/Home';
import Clients from '../src/components/Templates/Clients';
import Proposals from '../src/components/Templates/Proposals';
import Contracts from '../src/components/Templates/Contracts';
import Finances from '../src/components/Templates/Finances';
import Login from '../src/components/Templates/Login';
import AuthRegister from '../src/components/Templates/AuthRegister';
import ListUser from '../src/components/Templates/User/ListUser';
import NewUser from '../src/components/Templates/User/NewUser';
import EditUser from '../src/components/Templates/User/EditUser';
import EditAccessProfile from '../src/components/Templates/AccessProfile/EditAccessProfile';
import ListAccessProfile from '../src/components/Templates/AccessProfile/ListAccessProfile';
import NewAccessProfile from '../src/components/Templates/AccessProfile/NewAccessProfile';
import { getUser } from './utils/token';
import { useEffect, useState } from 'react';
import { verifyAccess } from './utils/verifyAccess';
import { Alert, Snackbar } from '@mui/material';
import { socket } from './socket';

function App() {
  const [getPermissionUser, setPermissionUser] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  // let getPermissionUser: any = {};

  const [socketInstance] = useState(socket());

  const handleOpen = () => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const temp = await verifyAccess();
        setPermissionUser(temp);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    socketInstance.on('proposal', () => {
      setOpen(true);
    })

    return () => {
      socketInstance.off('proposal');
    }
  }, [])

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/auth-register' element={<AuthRegister />} />
        <Route path='/*' element={<Navigate to={'/'} />} />
        <Route path='/' element={<PrivateRoute redirectTo='/login'>
          <Home />
        </PrivateRoute>} />
        {/* {getPermissionUser?.user?.read && ( */}
        <Route path='/clients' element={<PrivateRoute redirectTo='/login'>
          <Clients />
        </PrivateRoute>} />
        {/* )} */}
        {getPermissionUser?.proposal?.read && (
          <Route path='/proposals' element={<PrivateRoute redirectTo='/login'>
            <Proposals />
          </PrivateRoute>} />
        )}
        {/* {getPermissionUser?.user?.read && ( */}
        <Route path='/contracts' element={<PrivateRoute redirectTo='/login'>
          <Contracts />
        </PrivateRoute>} />
        {/* )} */}
        {/* {getPermissionUser?.user?.read && ( */}
        <Route path='/finances' element={<PrivateRoute redirectTo='/login'>
          <Finances />
        </PrivateRoute>} />
        {/* )} */}
        <>
          {getPermissionUser?.user?.read && (
            <Route path='/users' element={<PrivateRoute redirectTo='/login'>
              <ListUser />
            </PrivateRoute>} />
          )}
          {getPermissionUser?.user?.create && (
            <Route path='/users/new' element={<PrivateRoute redirectTo='/login'>
              <NewUser />
            </PrivateRoute>} />
          )}
          {getPermissionUser?.user?.update && (
            <Route path='/users/edit/:id' element={<PrivateRoute redirectTo='/login'>
              <EditUser />
            </PrivateRoute>} />
          )}
        </>
        <>
          {getPermissionUser?.permission?.read && (
            <Route path='/access-profile' element={<PrivateRoute redirectTo='/login'>
              <ListAccessProfile />
            </PrivateRoute>} />
          )}
          {getPermissionUser?.permission?.create && (
            <Route path='/access-profile/edit/:id' element={<PrivateRoute redirectTo='/login'>
              <EditAccessProfile />
            </PrivateRoute>} />
          )}
          {getPermissionUser?.permission?.update && (
            <Route path='/access-profile/new' element={<PrivateRoute redirectTo='/login'>
              <NewAccessProfile />
            </PrivateRoute>} />
          )}
        </>
      </Routes>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        autoHideDuration={6000}
        open={open}
        onClose={handleClose}
        message="I love snacks"
        key={'bottom' + 'left'}
      >
        <Alert severity="info">Houve uma atualização em PROPOSTAS</Alert>
      </Snackbar>
    </>
  )
}

export default App
