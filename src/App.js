import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import GroupIcon from '@material-ui/icons/Group';
import Store from '@material-ui/icons/Store';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Settings from '@material-ui/icons/Settings';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { SnackbarProvider } from 'notistack';

import Configuracion from './components/Configuracion/Configuracion';
import Clientes from './components/Clientes/Clientes';


const drawerWidth = 240;

const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    height: '100vh',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});



function Ventas() {
  return <h2>Ventas</h2>;
}

function Articulos() {
  return <h2>Articulos</h2>;
}

function NotFound() {
  return <h2>404</h2>;
}

////////////////////////////////////////////////////////////
// then our route config

const routes = [
  {
    path: "/ventas",
    component: Ventas
  },
  {
    path: "/clientes",
    component: Clientes,
  },
  {
    path: "/articulos",
    component: Articulos,
  },
  {
    path: "/configuracion",
    component: Configuracion,
  },
];

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}


class MiniDrawer extends React.Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme } = this.props;

    return (
    <Router>
    <SnackbarProvider maxSnack={3}>
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <IconButton 
            color="inherit"
            aria-label="Close drawer"
            onClick={this.handleDrawerClose} className={classNames(classes.menuButton, !this.state.open && classes.hide)}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              La Vendimia
            </Typography>
            <Typography style={{ flex: 1, marginRight: 12, textAlign: 'right' }} color="inherit">{(new Date()).toLocaleDateString('es-MX', DATE_OPTIONS)}</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}> 
          </div>
          <div>
		    <ListItem button component="a" href="/ventas">
		      <ListItemIcon>
		        <ShoppingCart />
		      </ListItemIcon>
		      <ListItemText primary="Ventas" />
		    </ListItem>
		  </div>
          <Divider />
          <div>
		    <ListItem button component="a" href="/clientes">
		      <ListItemIcon>
		        <GroupIcon />
		      </ListItemIcon>
		      <ListItemText primary="Clientes" />
		    </ListItem>
		    <ListItem button component="a" href="/articulos">
		      <ListItemIcon>
		        <Store />
		      </ListItemIcon>
		      <ListItemText primary="Artículos" />
		    </ListItem>
		    <ListItem button component="a" href="/configuracion">
		      <ListItemIcon>
		        <Settings />
		      </ListItemIcon>
		      <ListItemText primary="Configuración" />
		    </ListItem>
		  </div>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
           {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
        </main>
      </div>
      </SnackbarProvider>
      </Router>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);
