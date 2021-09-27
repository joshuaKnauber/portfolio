import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './Home/Home';
import Configurator from './Tesla/Configurator';


export default function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/tesla">
            <Configurator />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}