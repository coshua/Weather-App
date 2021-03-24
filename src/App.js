import React, { Component } from "react";
import {
  NavLink,
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";
import "./App.css";
import LangContext from "./components/LangContext";
import Weather from "./components/Weather"
// import WeatherRouter from "./components/WeatherRouter";
import About from "./components/About";
import Home from "./components/Home";
import ForecastList from "./components/ForecastList";
import Forecast from "./components/Forecast";

const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;
const TIMEZONE_API = process.env.REACT_APP_TIMEZONE_API_KEY;
const DEFAULT_LOCATION_ID = 5809844;

class App extends Component {
/*   state = {
    lang: "en",
  }; */

  constructor() {
    super();
    this.state = {
      lang: "en",
      loading: true,
      current: {},
      id: DEFAULT_LOCATION_ID,
      date: "",
      gmtOffset: 0,
      daily: [],
      hourly: []
    }
  };
  
  componentDidMount() {
    this.fetchWithId(this.state.id);
  };


  handleLoading = () => {
    this.setState({
      loading: !this.state.loading
    });
  };

  fetchWithId = (id) => {
    // let lang = this.context;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&APPID=${WEATHER_API}&lang=${this.state.lang}`
    )
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        var current = data;
        //var current = JSON.parse(JSON.stringify(data));
        this.setState({
          input: "",
          id: id,
          current: current,
        });
        return fetch(
          `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API}&format=json&by=position&lat=${this.state.current.coord.lat}&lng=${this.state.current.coord.lon}`
        );
      })
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        this.setState({
          date: `${data.abbreviation}, ${data.formatted.substring(5)}`,
          gmtOffset: data.gmtOffset,
          loading: false,
        });
      })
      .then(this.fetchForecast)
      .catch((error) => console.log("error!! ", error));
  };

  fetchForecast = () => {
    let lang = this.context;  
    console.log("lang = " + lang);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.current.coord.lat}&lon=${this.state.current.coord.lon}&
        exclude=current,minutely&appid=${WEATHER_API}&units=metric&lang=${lang}
        `)
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        this.setState({
          daily: data.daily,
          hourly: data.hourly,
        });
      });
  };

  toggleLang = () => {
    this.setState(({ lang }) => ({
      lang: lang === "kr" ? "en" : "kr",
    }));
  };

  render() {
    const { lang } = this.state;
    const { toggleLang } = this;
    return (
      <LangContext.Provider value={lang}>
        <div className="App">
          <Router>
            <main>
              <nav className="navBar">
                <ul>
                  <li>
                    <NavLink exact to="/weather">
                      {this.state.lang === "kr" ? "날씨" : "Weather"}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/about">
                      {this.state.lang === "kr" ? "정보" : "About"}
                    </NavLink>
                  </li>
                </ul>
              </nav>
              <button id="langButton" onClick={toggleLang}>
                {lang}
              </button>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/weather" render={({ match }) => (
                  <>
                    <Weather
                      handleLoading={this.handleLoading}
                      loading={this.state.loading}
                      fetchWithId={this.fetchWithId}
                      id={this.state.id}
                      current={this.state.current}
                      date={this.state.date}
                    />
                    <ForecastList
                      daily={this.state.daily}
                      gmtOffset={this.state.gmtOffset}
                      match={match}
                    />
                  </>
                )} />
                <Route exact path="/weather/:id" render={({ match }) => (
                  <Forecast
                    daily={this.state.daily}
                    current={this.state.current}
                    gmtOffset={this.state.gmtOffset}
                    match={match}
                  />
                )
                  
                }/>
                <Route path="/about" component={About} />
              </Switch>
            </main>

            <footer>Page created by Dongju</footer>
          </Router>
        </div>
      </LangContext.Provider>
    );
  }
}

export default App;
