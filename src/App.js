import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './Home/Home';
import Tesla from './Tesla/Tesla';


export default function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/tesla">
            <Tesla />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}