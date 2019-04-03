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
import LinearProgress from '@material-ui/core/LinearProgress';
import AsyncSelect from 'react-select/lib/Async';


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
  hide: {
    display: 'none',
  },
  button: {
    margin: theme.spacing.unit,
  },
  addButton: {
    float: 'right',
    background: '#4caf50'
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end"
  },
  root: {
    flexGrow: 1,
  },
  folio:{
        float: 'right',
    fontSize: '16px'
  }
});
const defaultData = {id_venta: 0, descripcion: "", precio: "", modelo: "", existencia: ""};

const defaultErrors = {
      descripcion: true,
      precio: true,
      existencia: true,
    };

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function moneda(cantidad){
  return (parseFloat(cantidad)).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });
}

function estatus(estatus){
  var label = "Activa";
  if (estatus != 1) {
    label = 'Inactiva';
  }
  return label;
}

class Ventas extends React.Component {
  
  state = {
    error: null,
    isLoaded: false,
    items: [],
    tableMode: false,
    modalData: JSON.parse(JSON.stringify(defaultData)),
    errors: defaultErrors,
    modalProcess: false,
    nextID: '0000',
    tableMode: false,
    loadOptions: [
            { label: 'Afghanistan', value: 1 },
            { label: 'Aland Islands', value: 2 },
            { label: 'Albania', value: 3 },
            { label: 'Anguilla', value: 4 }
          ]
  };

  filterSuggestions = (inputValue: string) => {
    console.log("filterSuggestions  => " + inputValue, this.state.loadOptions)
    return this.state.loadOptions.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

loadOptions = (inputValue, callback) => {
  callback(this.filterSuggestions(inputValue));
};

  handleClickOpen = () => {
    console.log("handleClickOpen")
      this.setState({ tableMode: false});

    
  };

  handleClose = () => {
    this.setState({ tableMode: true, modalData: JSON.parse(JSON.stringify(defaultData)), errors: defaultErrors });
  };

   handleCancel = () => {
    window.location.href= "/"
  };

  handleSubmit = event => {
    event.preventDefault();

    const errors = this.state.errors;
    const modalData = this.state.modalData;

    for (var k in errors){
      errors[k] = (modalData[k].length == 0);
      if (errors.hasOwnProperty(k) && errors[k]) {
        this.props.enqueueSnackbar('No es posible continuar, debe ingresar ' + k + ' es obligatorio');
        this.setState({
          errors: errors,
          
        });
        return false;
      }
  }
    const params = this.state.modalData;
    const items = this.state.items;

    this.setState({ modalProcess: true });

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: JSON.stringify(params),
      url: 'http://localhost/vendimia/api/setArticulos'
    };

    axios(options).then(res => {
      //console.log(res);
      if (res.data.success){
        if (params.id_venta == 0){
          params.id_venta = res.data.id_venta;
          items.push(params);
        }else{
          items[params.tableData.id] = params;
        }

        this.setState({ modalProcess: false, tableMode: true, items: items, modalData: JSON.parse(JSON.stringify(defaultData)), errors: defaultErrors, nextID: pad(res.data.nextID, 4) });
        
        this.props.enqueueSnackbar('Bien Hecho. El Venta ha sido registrado correctamente.');

      }else{
        this.setState({ modalProcess: false});
        this.props.enqueueSnackbar(res.data.message);
      }

        
      });
  }


   handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };

  

  componentDidMount() {
    fetch("http://localhost/vendimia/api/getVentas")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.data,
            nextID: pad(result.nextID, 4)
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
   
  };


  render() {
    const { classes } = this.props;
    const { error, isLoaded, items } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Cargando Tabla...</div>;
    } else if (this.state.tableMode){
      return (
      <React.Fragment>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="Agregar"
          className={classNames(classes.addButton,classes.margin)} 
          onClick={this.handleClickOpen}
        >
          <AddButton className={classes.extendedIcon} />
          Nueva Venta
        </Fab>
        <br/><br/><br/>
        <MaterialTable
          title="Registro de Ventas"
          columns={[
            { title: 'Clave Venta', field: 'id_venta',
              render: rowData => {
                return (
                  <div style={{ width: '100%'}}>
                    {pad(rowData.id_venta, 4)}
                  </div>
                )
              },
            },
            { title: 'Clave Cliente',
              render: rowData => {
                return (
                  <div style={{ width: '100%'}}>
                    {pad(rowData.FK_id_cliente, 4)}
                  </div>
                )
              },
            },
            { title: 'Nombre', field: 'nombre'},
            { title: 'Total', field: 'Total',
            render: rowData => {
                return (
                  <div style={{ width: '100%'}}>
                    {moneda(rowData.total)}
                  </div>
                )
              },
              
            },
            { title: 'Fecha', field: 'fecha'},
            { title: 'Estatus', field: 'estatus',
              render: rowData => {
                return (
                  <div style={{ width: '100%'}}>
                   {estatus(rowData.estatus)}
                  </div>
                )
              },
            },
          ]}
          data={this.state.items}
        />

    </React.Fragment>
  
    );
    }else{
      return (
        <React.Fragment>
        <Typography variant="h6" gutterBottom>
            Registro de Ventas
          </Typography>
          <Grid container spacing={24}>
            <Grid item sm={12}>
              <Grid item xs={6} sm={4}>
                <AsyncSelect
                  cacheOptions
                  loadOptions={this.loadOptions}
                  defaultOptions
                  onInputChange={this.handleInputChange}
                />
              </Grid>
            </Grid>

              
            <Grid item sm={12}>
              <div className={classes.actions}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.handleCancel}
                    className={classes.button}
                  >
                    Cancelar
                  </Button>
                 <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                    className={classes.button}
                    type="submit"
                  label="Submit"
                  >
                    Guardar
                  </Button>
              </div>
            </Grid>
        </Grid>
      </React.Fragment>
    );
  }
  }
}

export default withStyles(styles)(
    withSnackbar(Ventas),
);