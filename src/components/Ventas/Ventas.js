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


class Ventas extends React.Component {

  state = {
    error: null,
    isLoaded: false,
    items: []
  };

   handleCancel = () => {
    window.location.href= "/"
  };

  handleSubmit = event => {
    event.preventDefault();

    const params = this.state.items;

    

    axios.post('http://localhost/vendimia/api/setConfiguraciones', { params})
      .then(res => {
        this.props.enqueueSnackbar('Ajustes Guardados.');
      })
  }

  componentDidMount() {
    fetch("http://localhost/vendimia/api/getConfiguraciones")
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

   handleChange = (e, index) => {
    const items = this.state.items;
    items[index].valor = e.target.value;
    this.setState({
      items
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
	      <Typography variant="h6" gutterBottom>
	        Configuración General
	      </Typography>
	      <Grid container spacing={24}>
	      	{items.map((item, i) => (
            <Grid item xs={12} sm={6} key={item.id}>
			        <TextField
			          id="config-{item.id}"
			          label={item.nombre || ''}
			          value={item.valor || ''}
			          type="number"
			          className={classes.textField}
			          InputLabelProps={{
			            shrink: true,
			          }}
			          onChange={(e) => {this.handleChange(e, i)}}
		        	margin="normal"
		        />
		     </Grid>
        	))}
		    	
		        
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