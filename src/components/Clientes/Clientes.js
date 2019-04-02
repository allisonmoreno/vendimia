import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import EditButton from '@material-ui/icons/Edit';
import AddButton from '@material-ui/icons/Add';
import MaterialTable from 'material-table'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end"
  }
});
const defaultData = {id: 0, nombre: "", paterno: "", materno: "", rfc: ""};

const defaultErrors = {
      nombre: false,
      paterno: false,
      rfc: false,
    };


class Clientes extends React.Component {
  
  state = {
    error: null,
    isLoaded: false,
    items: [],
    open: false,
    modalData: defaultData,
    errors: defaultErrors
  };

  handleClickOpen = (paramData = {}) => {
  console.log(paramData, (typeof paramData));
    if (paramData && typeof paramData.id_cliente != "undefined"){
      this.setState({ open: true, modalData: paramData});
    }else{
      this.setState({ open: true, modalData: defaultData});
    }
    
  };

  handleClose = () => {
    this.setState({ open: false, modalData: defaultData , errors: defaultErrors });
  };

   handleCancel = () => {
    window.location.href= "/"
  };

  handleSubmit = event => {
    event.preventDefault();

    const params = this.state.items;

    

    axios.post('http://localhost/vendimia/api/setConfiguraciones', { params})
      .then(res => {
        this.props.enqueueSnackbar('Bien Hecho. El cliente ha sido registrado correctamente.');
      })
  }

  componentDidMount() {
    fetch("http://localhost/vendimia/api/getClientes")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.data
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

   handleChange = (e) => {
    const modalData = this.state.modalData;
    const errors = this.state.errors;
    modalData[e.target.name] = e.target.value;
    if (e.target.required){
      errors[e.target.name] = (e.target.value.length == 0);
    }
    this.setState({
      modalData: modalData,
      errors: errors
    });
  };


  render() {
    const { classes } = this.props;

     const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Cargando Configuración...</div>;
    } else {
      return (
      <React.Fragment>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="Add"
          className={classes.margin}
          onClick={this.handleClickOpen}
        >
          <AddButton className={classes.extendedIcon} />
          Nuevo Cliente
        </Fab>
        <br/><br/>
        <MaterialTable
          title="Registro de Clientes"
          columns={[
            { title: 'Nombre', field: 'nombre' },
            { title: 'Paterno', field: 'paterno' },
            { title: 'Materno', field: 'materno' },
            { title: 'RFC', field: 'rfc' },
            { title: 'Editar',
              render: rowData => {
                return (
                  <div style={{ width: '100%'}}>
                    <IconButton aria-label="Delete" className={classes.margin} onClick={(e) => {this.handleClickOpen(JSON.parse(JSON.stringify(rowData)))}}>
                      <EditButton fontSize="small" />
                    </IconButton>
                  </div>
                )
              },
            },
          ]}
          data={this.state.items}
        />

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Registro de Clientes</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="modalNombre"
              name="nombre"
              label="Nombre"
              type="text"
              value={this.state.modalData.nombre}
              error={this.state.errors.nombre}
              onChange={this.handleChange}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="modalPaterno"
              name="paterno"
              label="Apellido Paterno"
              type="text"
              value={this.state.modalData.paterno}
              error={this.state.errors.paterno}
              onChange={this.handleChange}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="modalMaterno"
              name="materno"
              label="Apellido Materno"
              type="text"
              value={this.state.modalData.materno}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="modalRFC"
              name="rfc"
              label="RFC"
              type="text"
              required
              value={this.state.modalData.rfc}
              error={this.state.errors.rfc}
              onChange={this.handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
    </React.Fragment>
    );
  	}
  }
}

export default withStyles(styles)(
    withSnackbar(Clientes),
);