import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Toolbar, IconButton, Typography, Popover, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { deleteJwtToken, deleteUser, getJwtToken } from '../../../utils/token';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';
import Drawer from '@mui/material/Drawer';
import { AccountCircle } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { verifyAccess } from '../../../utils/verifyAccess';
import * as S from './NavBar.style'

function NavBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [state, setState] = useState(false,);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [getPermissionUser, setPermissionUser] = useState<any>([]);
  // let getPermissionUser: any = {};

  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState(open);
      };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    deleteJwtToken();
    deleteUser();
    navigate('/login');
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

  return (
    <>
      {!!getJwtToken() && !!(getPermissionUser) && (
        <>
          <AppBar position='static'>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'start' }}>
                CMS
              </Typography>
              <div>
                <IconButton
                  size="small"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle style={{ width: 35, height: 35 }} />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            anchor={'left'}
            open={state}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250, padding: '12px' }}
              role="presentation"
            // onClick={toggleDrawer(false)}
            // onKeyDown={toggleDrawer(false)}
            >
              <Avatar variant='square' sx={{ width: '100%', height: '50px', marginBottom: '30px' }} />
              <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Link to={'/'} color={'black'}>
                  <Grid sx={{ display: 'flex', gap: '10px' }}>
                    <DashboardIcon color={window.location.href.includes('home') ? 'secondary' : 'primary'} />
                    <Typography color={window.location.href.includes('home') ? 'secondary' : 'primary'}>Dashboard</Typography>
                  </Grid>
                </Link>

                {getPermissionUser?.user?.read && (
                  <Link to={'/clients'}>
                    <Grid sx={{ display: 'flex', gap: '10px' }}>
                      <PeopleAltIcon color={window.location.href.includes('clients') ? 'secondary' : 'primary'} />
                      <Typography color={window.location.href.includes('clients') ? 'secondary' : 'primary'}>Clientes</Typography>
                    </Grid>
                  </Link>
                )}

                {getPermissionUser?.proposal?.read && (
                  <Link to={'/proposals'}>
                    <Grid sx={{ display: 'flex', gap: '10px' }}>
                      <InventoryIcon color={window.location.href.includes('proposals') ? 'secondary' : 'primary'} />
                      <Typography color={window.location.href.includes('proposals') ? 'secondary' : 'primary'}>Propostas</Typography>
                    </Grid>
                  </Link>
                )}

                {getPermissionUser?.user?.read && (
                  <Link to={'/contracts'}>
                    <Grid sx={{ display: 'flex', gap: '10px' }}>
                      <DescriptionIcon color={window.location.href.includes('contracts') ? 'secondary' : 'primary'} />
                      <Typography color={window.location.href.includes('contracts') ? 'secondary' : 'primary'}>Contratos</Typography>
                    </Grid>
                  </Link>
                )}

                {getPermissionUser?.user?.read && (
                  <Link to={'/finances'}>
                    <Grid sx={{ display: 'flex', gap: '10px' }}>
                      <AccountBalanceWalletIcon color={window.location.href.includes('finances') ? 'secondary' : 'primary'} />
                      <Typography color={window.location.href.includes('finances') ? 'secondary' : 'primary'}>Finanças</Typography>
                    </Grid>
                  </Link>
                )}

                {getPermissionUser?.user?.read && (
                  <Link to={'/users'}>
                    <Grid sx={{ display: 'flex', gap: '10px' }}>
                      <ManageAccountsIcon color={window.location.href.includes('user') ? 'secondary' : 'primary'} />
                      <Typography color={window.location.href.includes('user') ? 'secondary' : 'primary'}>Administradores</Typography>
                    </Grid>
                  </Link>
                )}

                {getPermissionUser?.permission?.read && (
                  <Link to={'/access-profile'}>
                    <Grid sx={{ display: 'flex', gap: '10px' }}>
                      <LibraryBooksIcon color={window.location.href.includes('access-profile') ? 'secondary' : 'primary'} />
                      <Typography color={window.location.href.includes('access-profile') ? 'secondary' : 'primary'}>Perfil de acesso</Typography>
                    </Grid>
                  </Link>
                )}
              </Grid>
            </Box>
          </Drawer>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Button onClick={handleLogout}>Sair</Button>
          </Popover>
        </>
      )}
    </>
  )
}

export default NavBar;
