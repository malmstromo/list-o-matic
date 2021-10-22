import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { About } from './pages/About';
import { Home } from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

export const App = () => {
  return (
    <Switch>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};
