import React, { Component } from 'react';
import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import WeatherRouter from './components/WeatherRouter';
import About from './components/About';
import Home from './components/Home';

class App extends Component {

  render() {
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
                <NavLink exact to="/weather">
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
              <Route exact path="/" component={Home} />
              <Route path="/weather" component={WeatherRouter} />
              <Route path="/about" component={About} />
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
