import React from 'react';
import {BrowserRouter,  Route,  Switch} from 'react-router-dom';

import Ventas from '././components/Ventas/Ventas';
import Inicio from '././components/Inicio/Inicio';
import NotFound from '././components/NotFound/NotFound';


const Routes = () => (
  <BrowserRouter >
      <Switch>
          <Route exact path="/" component={Inicio}/>
          <Route path="/ventas" component={Ventas}/>
          <Route path="*" component={NotFound}/>
      </Switch>
  </BrowserRouter>
);

export default Routes;