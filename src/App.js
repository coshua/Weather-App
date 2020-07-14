import React, { Component } from 'react';
import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
// import { Nav, Navbar, NavItem} from "react-bootstrap";
import './App.css';
import Weather from './components/Weather';
import About from './components/About';

class App extends Component {

  render() {
    console.log("App rendered");
    return (

      <div className="App">
{/*           <header className="App-header">
            <h1>React Weather App</h1>
          </header> */}
          <Router>
          <main>
          <nav className="navBar">
            <ul>
              <li>
                <NavLink exact to="/">
                  Weather
                </NavLink>
              </li>
              <li>
                <NavLink to="/about">
                  About
                </NavLink>
              </li>
            </ul>
            </nav>
            <Switch>
              <Route exact path="/" component={Weather} />
              <Route exact path="/about" component={About} />
            </Switch>
          </main>

          <footer>
            Page created by Joshua
          </footer>
        </Router>
      </div>
    )
  };
}

export default App;
