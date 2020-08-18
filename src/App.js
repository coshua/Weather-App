import React, { Component } from 'react';
import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import LangContext from './components/LangContext';
import WeatherRouter from './components/WeatherRouter';
import About from './components/About';
import Home from './components/Home';

class App extends Component {
  state = { lang: "kr" }

  toggleLang = () => {
    this.setState(({ lang }) => ({
      lang: lang === "kr" ? "en" : "kr",
    }))
  }

  render() {
    const { lang } = this.state;
    const {
      toggleLang
    } = this;
    return (
      <LangContext.Provider value={lang}>
        <div className="App">
          {/*           <header className="App-header">
            <h1>React Weather App</h1>
          </header> */}
          <head>
            <title>Weather</title>
          </head>
          <Router>
            <main>
              <nav className="navBar">
                <ul>
                  <li>
                    <NavLink exact to="/weather">
                      {this.state.lang==="kr" ? "날씨" : "Weather"}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/about">
                      {this.state.lang==="kr" ? "정보" : "About"}
                    </NavLink>
                  </li>
                </ul>
              </nav>
              <button id="langButton" onClick={toggleLang}>{lang}</button>
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
      </LangContext.Provider>
    )
  };
}

export default App;
