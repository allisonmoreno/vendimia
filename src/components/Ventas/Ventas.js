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
import DeleteButton from '@material-ui/icons/Delete';
import AddButton from '@material-ui/icons/Add';
import MaterialTable from 'material-table'
import LinearProgress from '@material-ui/core/LinearProgress';
import AsyncSelect from 'react-select/lib/Async';
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import FormLabel from '@material-ui/core/FormLabel';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
   input: {
    display: 'flex',
    padding: 0,
  },
  FormLabel:{
    lineHeight: 2
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  hide: {
    display: 'none',
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  addButton: {
    background: '#8bc34a',
     "&:hover": {
      background: "#4caf50"
    },
  },
  fright:{
    float: 'right',
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end"
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


function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper square style={{
        zIndex: 100
      }} 
      className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};


class Ventas extends React.Component {
  
  state = {
    error: null,
    isLoaded: false,
    items: [],
    tableMode: false,
    errors: defaultErrors,
    modalProcess: false,
    nextID: '0000',
    tableMode: false,
    loadClientes: [],
    loadArticulos: [],
    selectedCliente: null,
    selectedArticulo: null,
    rfc: "",
    articulos: []
  };

  filterClientes = (inputValue: string) => {
    //console.log("filterSuggestions  => " + inputValue, this.state.loadClientes)
    if (this.state.loadClientes.length > 0){
      return this.state.loadClientes.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }else{
      return []
    }
  };
  
  filterArticulos = (inputValue: string) => {
    //console.log("filterSuggestions  => " + inputValue, this.state.loadClientes)
    if (this.state.loadArticulos.length > 0){
      return this.state.loadArticulos.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }else{
      return []
    }
  };

loadClientes = (inputValue, callback) => {
  const options = {
      method: 'GET',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      url: 'http://localhost/vendimia/api/searchClientes/' + encodeURIComponent(inputValue)
    };

    axios(options).then(res => {
      //console.log(res);
      if (res.data.success){
        this.setState({loadClientes: res.data.data});
        callback(this.filterClientes(inputValue));
      }
        
      });
};

loadArticulos= (inputValue, callback) => {
  const options = {
      method: 'GET',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      url: 'http://localhost/vendimia/api/searchArticulos/' + encodeURIComponent(inputValue)
    };

    axios(options).then(res => {
      //console.log(res);
      if (res.data.success){
        this.setState({loadArticulos: res.data.data});
        callback(this.filterArticulos(inputValue));
      }
        
      });
};

  handleClickAddArticulo = () => {
    const articulo = JSON.parse(JSON.stringify(this.state.selectedArticulo));
    const articulos = JSON.parse(JSON.stringify(this.state.articulos));
    if (articulo.existencia > 0){
      var cantidad = this.getCantidadArticulo(articulo.value);
      if (cantidad > 0){
        if ( cantidad < articulo.existencia){
          var pos = articulos.map(function(e) { return e.value; }).indexOf(articulo.value);
          articulos[pos].cantidad = cantidad + 1;
        }
      }else{
        articulo.cantidad = 1;
        articulos.push(articulo);
      }
      
      this.setState({ articulos: articulos});
    }
  };

  getCantidadArticulo = (id) => {
    if (this.state.articulos.length > 0){
      const filtered = this.state.articulos.filter(i =>
        i.value == id
      );
      //console.log("filtered",filtered);
      if (filtered.length > 0 && typeof filtered[0].cantidad != "undefined"){
        return filtered[0].cantidad
      }else{
        return 0;
      }
    } 
    return 0;
  }

  //handleClickDeleteArticulo

  handleClickDeleteArticulo = (paramData = {}) => {
    if (paramData && typeof paramData.value != "undefined"){
      const articulos = JSON.parse(JSON.stringify(this.state.articulos));

      var pos = articulos.map(function(e) { return e.value; }).indexOf(paramData.value);
      articulos.splice(pos, 1);
      this.setState({ articulos: articulos});
    }
    
  };

  handleClickOpen = () => {
      this.setState({ tableMode: false});
  };

   handleCancel = () => {
    this.setState({ tableMode: true});
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

        this.setState({ modalProcess: false, tableMode: true, items: items, errors: defaultErrors, nextID: pad(res.data.nextID, 4) });
        
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

  handleChangeCliente = (selectedCliente) => {
    if (selectedCliente != null && selectedCliente.rfc != null){
      var data = JSON.parse(JSON.stringify(selectedCliente))
      data.label = pad(data.value, 4) + " - " + data.label
      this.setState({
        rfc: "RFC: " + data.rfc,
        selectedCliente: data
      });
    }else{
      
      this.setState({
        rfc: "",
        selectedCliente: null
      });
    }
  }

   handleChangeArticulo = (selectedArticulo) => {
    if (selectedArticulo != null && selectedArticulo.value != null){
      var data = JSON.parse(JSON.stringify(selectedArticulo))
      //data.label = pad(data.value, 4) + " - " + data.label
      this.setState({
        selectedArticulo: data
      });
    }else{
      
      this.setState({
        selectedArticulo: null
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { error, isLoaded, items, selectedCliente, selectedArticulo } = this.state;

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
          className={classNames(classes.addButton,classes.margin,classes.fright)} 
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
          <div><span className={classes.folio}>Folio Venta: {this.state.nextID}</span></div>
          <Grid container spacing={24}>
            <Grid item xs={5}>
              <AsyncSelect
                classes={classes}
                components={components}
                value={selectedCliente}
                onChange={this.handleChangeCliente}
                placeholder="Cliente:"
                isClearable
                cacheOptions
                loadOptions={this.loadClientes}
                defaultOptions
                onInputChange={this.handleInputChange}
              />

            </Grid>
            <Grid item xs={6}>
              <FormLabel component="legend" className={classes.FormLabel}>{this.state.rfc}</FormLabel>
            </Grid>
            
            <Grid item xs={5}>
              <AsyncSelect
                classes={classes}
                components={components}
                value={selectedArticulo}
                onChange={this.handleChangeArticulo}
                placeholder="Artículo:"
                isClearable
                cacheOptions
                loadOptions={this.loadArticulos}
                defaultOptions
                onInputChange={this.handleInputChange}
              />

            </Grid>
            <Grid item xs={6}>
              <Fab size="small" color="secondary" aria-label="Add"
              className={classNames(classes.addButton,classes.margin,(this.state.selectedArticulo === null) && classes.hide)} 
              onClick={this.handleClickAddArticulo}
              >
                <AddIcon />
              </Fab>
            </Grid>
            <Grid item xs={12}>
                <MaterialTable
                title=""
                columns={[
                  { title: 'Descripción Artículo', field: 'label' },
                  { title: 'Modelo', field: 'modelo' },
                  { title: 'Cantidad', field: 'cantidad' },
                  { title: 'Precio', field: 'precio',
                     render: rowData => {
                      return (
                        <div style={{ width: '100%'}}>
                          {moneda(rowData.precio)}
                        </div>
                      )
                    },
                  },
                  { title: 'Importe',
                    render: rowData => {
                        return (
                          <div style={{ width: '100%'}}>
                            {moneda((parseFloat(rowData.precio)*parseInt(rowData.cantidad)))}
                          </div>
                        )
                    },
                  },
                  { title: '',
                    render: rowData => {
                      return (
                        <div style={{ width: '100%'}}>
                          <IconButton aria-label="Editar" className={classes.margin} onClick={(e) => {this.handleClickDeleteArticulo(JSON.parse(JSON.stringify(rowData)))}}>
                            <DeleteButton fontSize="small" />
                          </IconButton>
                        </div>
                      )
                    },
                  },
                ]}
                data={this.state.articulos}
              />
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
                    Siguiente
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