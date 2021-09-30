import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './Home/Home';
import Configurator from './Tesla/Configurator';


function Main() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/tesla">
        <Configurator />
      </Route>
    </Switch>
  );
}


export default function App() {
  return (
    <div className="App">
      <Main/>
    </div>
  );
}