import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';



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


class TextFields extends React.Component {


  state = {
    error: null,
    isLoaded: false,
    data: {tasa: 0, enganche: 0, plazo: 0}
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

   handleCancel = () => {
    window.location.href= "/"
  };

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
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
		    <Grid item xs={12} sm={6}>
		        <TextField
		          id="standard-number"
		          label="Tasa de Interés"
		          value={this.state.data.tasa}
		          onChange={this.handleChange('tasa')}
		          type="number"
		          className={classes.textField}
		          InputLabelProps={{
		            shrink: true,
		          }}
		          margin="normal"
		        />
		        </Grid>
		        <Grid item xs={12} sm={6}>
		        <TextField
		          id="standard-number"
		          label="% de Enganche"
		          value={this.state.data.tasa}
		          onChange={this.handleChange('tasa')}
		          type="number"
		          className={classes.textField}
		          InputLabelProps={{
		            shrink: true,
		          }}
		          InputProps={{
		            startAdornment: <InputAdornment position="start">%</InputAdornment>,
		          }}
		          margin="normal"
		        />
		        </Grid>
		        <Grid item xs={12} sm={6}>
			        <TextField
			          id="standard-number"
			          label="Plazo Máximo"
			          value={this.state.data.tasa}
			          onChange={this.handleChange('tasa')}
			          type="number"
			          className={classes.textField}
			          InputLabelProps={{
			            shrink: true,
			          }}
			          margin="normal"
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
		              onClick={this.handleNext}
		              className={classes.button}
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

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);