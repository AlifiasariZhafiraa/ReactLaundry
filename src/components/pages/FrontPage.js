import * as React from 'react';
import { styled, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import foto from './img/londre.jpg';

// icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MemberIcon from '@mui/icons-material/Group';
import OutletIcon from '@mui/icons-material/Store';
import PaketIcon from '@mui/icons-material/LocalGroceryStore';
import UserIcon from '@mui/icons-material/AccountBox';
import TransaksiIcon from '@mui/icons-material/ReceiptLong';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MainRoute } from '../../components/pages/main/MainRoute';
import getRole from '../../utils/access'
import mdTheme from '../../utils/Style'


const base_url = "http://localhost:8000/api"

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  backgroundColor: '#99C997',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      backgroundColor: '#779976',
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


const useStyles = makeStyles({
  leftContainer: {
    backgroundImage: `url(${foto})`,
    // background: 'linear-gradient(to right, #00bbd3, #ffd967)',
    // backgroundColor: '#fffde7',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  rightContainer: {
    // backgroundImage: 'url(https://source.unsplash.com/random)',
    // background: 'linear-gradient(to right, #00bbd3 80%, )',
    backgroundColor: '#ffd967',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})



const createNavList = (name, to, icon, presence) => {
  return { name, to, icon, presence }
}


export default function FrontPage() {
  React.useEffect(() => {
    const user = getRole()
    if (user !== undefined) {
      handleNav(user)
    } else {
      console.log('denied')
    }
  }, [])

  const [navPresence, setNavPresence] = React.useState('none');
  const [loginPresence, setLoginPresence] = React.useState('block');
  const [navlistPresence, setnavlistPresence] = React.useState({
    dashboard: 'block',
    member: 'block',
    outlet: 'block',
    paket: 'block',
    user: 'block',
    transaksi: 'block',
    laporan: 'block'
  });

  const navList = [
    createNavList('Dashboard', '/dashboard', <DashboardIcon sx={{ color: 'white' }} />, navlistPresence.dashboard),
    createNavList('User', '/user', <UserIcon sx={{ color: 'white' }} />, navlistPresence.user),
    createNavList('Paket', '/paket', <PaketIcon sx={{ color: 'white' }} />, navlistPresence.paket),
    createNavList('Outlet', '/outlet', <OutletIcon sx={{ color: 'white' }} />, navlistPresence.outlet),
    createNavList('Member', '/member', <MemberIcon sx={{ color: 'white' }} />, navlistPresence.member),
    createNavList('Kasir', '/transaksi', <TransaksiIcon sx={{ color: 'white' }} />, navlistPresence.transaksi),
    createNavList('Laporan', '/generate/laporan', <TransaksiIcon sx={{ color: 'white' }} />, navlistPresence.laporan),
  ]


  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNav = (user) => {
    const newList = {
      dashboard: 'block',
      member: 'block',
      outlet: 'block',
      paket: 'block',
      user: 'block',
      transaksi: 'block',
      laporan: 'block'
    }

    if (user === 'kasir') {
      newList.outlet = 'none'
      newList.paket = 'none'
      newList.user = 'none'
      newList.laporan = 'none'
    }

    if (user === 'owner') {
      newList.member = 'none'
      newList.outlet = 'none'
      newList.paket = 'none'
      newList.user = 'none'
      newList.transaksi = 'none'
    }

    setnavlistPresence(newList)
    setNavPresence('block')
    setLoginPresence('none')
  }

  // import styles
  const classes = useStyles();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      username: data.get('username'),
      password: data.get('password'),
    }

    const url = base_url + '/user/login'

    try {
      let result = await axios.post(url, payload)
      if (result.status === 200) {
        window.location = '/dashboard'
        localStorage.setItem("role", result.data.data.role)
        localStorage.setItem("token", result.data.data.token)
        localStorage.setItem("userId", result.data.data.id_user)

        handleNav(result.data.data.role)
      }
    } catch (error) {
      console.log(error)
      window.alert('incorrect password or username')
    }

  };

  const handleLogout = () => {
    localStorage.removeItem("role")
    localStorage.removeItem("token")
    window.location = '/'
  }

  return (
    <>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: loginPresence }}>
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              className={classes.leftContainer}
            >
              <Box
                sx={{
                  marginTop: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box component={Paper} elevation={5}
                  sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '25vw',
                    borderRadius: 3,
                  }}
                >

                  <Typography component="h1" variant="h5" >
                    Login
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      color="light"
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      color="light"
                      sx={{ borderRadius: 3 }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      color="light"
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ backgroundColor: "#99C997" }}>
              <Box
                sx={{
                  paddingTop: '40%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%'
                }}
              >

                <Typography noWrap sx={{ textAlign: 'center' }} variant='h2' component='h5'>
                  <b>Laundry</b>
                </Typography>
                <Typography noWrap sx={{ textAlign: 'center' }} variant='h3' component='h5'>
                  <b>Zone.</b>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Page with sidebar route */}
        <Box sx={{ display: navPresence }}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open} >
              <Toolbar
                sx={{
                  pr: '24px', // keep right padding when drawer closed
                }}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
                >
                  <b>Laundry Zone</b>
                </Typography>
                <IconButton color="inherit" onClick={() => handleLogout()}>
                  <LogoutIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
              <Toolbar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [1]
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List component="nav" >
                {
                  navList.map(item => (
                    <Link to={item.to} style={{ textDecoration: 'none', color: 'white', display: item.presence }}>
                      <ListItemButton>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </Link>
                  ))
                }
              </List>
            </Drawer>
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.primary.soft
                    : theme.palette.primary.soft[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}
            >
              <Toolbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  <MainRoute />
                </Grid>
              </Container>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  )
}