import React, { Component } from 'react';
import weathercss from './Weather.module.css';
import './Weather.css';
import Forecast from './Forecast';
import city from './city';
import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BookmarkFill, Bookmark } from 'react-bootstrap-icons';

const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;
const TIMEZONE_API = process.env.REACT_APP_TIMEZONE_API_KEY;
const LANGUAGE = "kr";
const DEFAULT_LOCATION_ID = 1842025;

class Weather extends Component {
   constructor() {
      super();
      this.state = {
         loading: true,
         input: '',
         id: DEFAULT_LOCATION_ID,
         coord: {
            lng: '',
            lat: '',
         },
         weather: {
            name: '',
            main: '',
            description: '',
            temp: '',
            feels_like: '',
            wind: '',
            icon: '',
         },
         date: '',
         error: '',
         daily: [],
         hourly: [],
         bookmark: [],
      };
   }

   showBookmarkList = () => {
      const { bookmark } = this.state;
      const list = bookmark.map(
         (bookmark, key) => <a key={key} onClick={() => this.fetchWithId(bookmark.id)}>
            {bookmark.name}
         </a>
      );


      return (
         <div className="dropdown">
            <button className="dropbt">Bookmarked City</button>
            <div className="dropdown-content">
               {list}
            </div>
         </div>
      );
   }

   handleChange = (e) => {
      this.setState({
         input: e.target.value
      });
   }

   fetchWithId = (id) => {
      fetch(`http://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&APPID=${WEATHER_API}&lang=${LANGUAGE}`)
         .then(results => {
            return results.json();
         }).then((data) => {
            console.log(data);
            this.setState({
               input: '',
               id: id,
               coord: {
                  lng: data.coord.lon,
                  lat: data.coord.lat
               },
               weather: {
                  name: data.name,
                  main: data.weather[0].main,
                  description: data.weather[0].description,
                  temp: data.main.temp,
                  feels_like: data.main.feels_like,
                  wind: data.wind.speed,
                  icon: data.weather[0].icon,
               },
            });
            console.log("updated " + data.name);
            return fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API}&format=json&by=position&lat=${this.state.coord.lat}&lng=${this.state.coord.lng}`);
         }).then(results => {
            return results.json();
         }).then((data) => {
            this.setState({
               date: `${data.abbreviation}, ${data.formatted.substring(5)}`,
               loading: false,
            });
         }).then(this.fetchForecast).catch(error => console.log("error!! ", error));
   }

   fetchForecast = () => {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.coord.lat}&lon=${this.state.coord.lng}&
      exclude=current,minutely&appid=${WEATHER_API}&units=metric&lang=${LANGUAGE}
      `).then(results => {
         return results.json();
      }).then(data => {
         var dailyWeather = JSON.parse(JSON.stringify(data.daily));
         this.setState({
            daily: dailyWeather,
            hourly: data.hourly,
         })
         console.log(data);
      })
   }

   convertUnixToDate = (unix) => {
      return new Date(unix * 1000);
   }

   handleSubmit = (e) => {
      e.preventDefault(); //need to understand
      const matched = city.filter((data) => {
         return (data.name.toLowerCase() === (this.state.input.toLowerCase()));
      });

      if (matched.length > 0) {
         this.setState({
            loading: true,
            error: '',
         });
         this.fetchWithId(matched[0].id);
      } else {
         this.setState({ error: 'Invalid city' });
      };
   }

   removeFromBookmark = (e) => {
      e.preventDefault();
      const { bookmark } = this.state;
      this.setState({
         bookmark: bookmark.filter(data => data.id !== this.state.id),
      })
   }

   addToBookmark = (e) => {
      e.preventDefault();
      const { bookmark } = this.state;
      this.setState({
         bookmark: bookmark.concat({ id: this.state.id, name: this.state.weather.name }),
      })
   }

   isWhetherMarked = () => {
      const { bookmark } = this.state;
      if (bookmark.length === 0) return false;
      let filtered = bookmark.filter(data => data.id !== this.state.id);
      return filtered.length !== bookmark.length;
   }

   // handleKeyPress = (e) => {
   //    if (e.key === 'Enter') {
   //       this.handleSubmit();
   //    }
   // }

   routeForecast = () => {
      if (this.state.daily.length > 0) {
         const { daily } = this.state;
         const forecastRouter = daily.map((daily, number) =>
            <NavLink to={`/${number}`}>
               <img src={`http://openweathermap.org/img/wn/${daily.weather[0].icon}@2x.png`} alt="Icon" />
            </NavLink>
         );
         const forecastSwitch = this.state.daily.map((daily, number) =>
            <Route exact path={`/${number}`} render={({history}) => (<Forecast daily={daily} history={history}/>)} />
            // <Route path={`${this.props.match.path}/:number}`} component={Forecast} />
         );
         return (
            <div className="forecast">
               {forecastRouter}
               <Switch>
                  {forecastSwitch}
               </Switch>
            </div>
         )
      } else {
         return (
            <div>
               <FontAwesomeIcon icon={faSpinner} pulse />
            </div>
         )
      };
   }

   componentDidMount() {
      this.fetchWithId(this.state.id);
   }

   render() {
      console.log("Weather rendered");
      const {
         handleChange,
         handleSubmit,
         removeFromBookmark,
         addToBookmark,
         isWhetherMarked,
         showBookmarkList,
         routeForecast,
      } = this;
      // const {
      //    loading,
      //    date
      // } = this.state;
      const { error, input, weather, loading, date } = this.state;
      return (
         <Router>
            <div className="weather">
               <div className="form">
                  <form onSubmit={handleSubmit} autoComplete="off">
                     <span className="bookmark">{isWhetherMarked() ? (<BookmarkFill onClick={removeFromBookmark} />) : <Bookmark onClick={addToBookmark} />}</span>
                     <input placeholder="Busan" type="text" id={error.length > 0 ? 'error' : 'city'} name="city" value={input} onChange={handleChange} required />
                     <span className="message">{error}</span>
                     <div className="create-button" onClick={handleSubmit}>
                        Find
                  </div>
                  </form>
               </div>
               <div>
                  {showBookmarkList()}
               </div>
               <div className={weathercss.name}>
                  {weather.name}, {weather.temp}°C
            </div>
               <div className={weathercss.time}>
                  {loading ? (<FontAwesomeIcon icon={faSpinner} pulse />) : (date)}
               </div>

               <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Icon" />
               {routeForecast()}


               <div className={weathercss.main}>
                  {weather.main} <FontAwesomeIcon icon={faWind} />
                  {weather.wind}m/s
            </div>
               <div className={weathercss.description}>
                  {weather.description}
               </div>
            </div>
         </Router>
      )
   }
}
export default Weather;