import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import { routes } from "./routes"


function RouterSwitch(props) {
  return (
    <Switch>
      {routes.map(route => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  );
}

export default RouterSwitch;
