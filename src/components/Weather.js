import React, { Component } from 'react';
import weathercss from './Weather.module.css';
import './Weather.css';
import city from './city';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWind, faSpinner } from '@fortawesome/free-solid-svg-icons'

const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;
const TIMEZONE_API = process.env.REACT_APP_TIMEZONE_API_KEY;
const LANGUAGE = "kr";

class Forecast extends Component {

   constructor() {
      super();
      this.state = {
         loading: true,
         input: '',
         id: '1835847',
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
      };
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
      exclude={part}&appid=${WEATHER_API}&units=metric&lang=${LANGUAGE}
      `).then(results => {
         return results.json();
      }).then(data => {
         console.log(data);
      })
   }

   handleSubmit = (e) => {
      e.preventDefault(); //need to understand
      const matched = city.filter((data) => {
         return (data.name.toLowerCase() === (this.state.input.toLowerCase()));
      });

      if (matched.length > 0) {
         this.setState({ loading: true,
                        error: '', });
         this.fetchWithId(matched[0].id);
      } else {
         this.setState({ error: 'Invalid city'});
      };
   }

   // handleKeyPress = (e) => {
   //    if (e.key === 'Enter') {
   //       this.handleSubmit();
   //    }
   // }

   componentDidMount() {
      this.fetchWithId(this.state.id);
   }

   render() {
      const {
         handleChange,
         handleSubmit,
      } = this;
      // const {
      //    loading,
      //    date
      // } = this.state;
      const { error, input, weather, loading, date} = this.state;
      return (
         <div className="weather">
            <div className="form">
               <form onSubmit={handleSubmit}>
                  <input type="text" id={error.length > 0 ? 'error' : 'city'} name="city" value={input} onChange={handleChange} />
                  <span className="message">{error}</span>
                  <div className="create-button" onClick={handleSubmit}>
                     Find
                  </div>
               </form>
            </div>
            <div className={weathercss.name}>
               {weather.name}, {weather.temp}°C
            </div>
            <div className={weathercss.time}>
               {loading ? (<FontAwesomeIcon icon={faSpinner} pulse />) :(date)}
            </div>
            <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Icon" />

            <div className={weathercss.main}>
               {weather.main} <FontAwesomeIcon icon={faWind} />
               {weather.wind}m/s
            </div>
            <div className={weathercss.description}>
               {weather.description}
            </div>
         </div>
      )
   }
}
export default Forecast;