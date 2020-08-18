import React, { Component } from 'react';
import weathercss from './Weather.module.css';
import './Weather.css';
// import Forecast from './Forecast';
// import city from './city';
// import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BookmarkFill, Bookmark } from 'react-bootstrap-icons';
import LangContext from "./LangContext";

const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;
const TIMEZONE_API = process.env.REACT_APP_TIMEZONE_API_KEY;
const LANGUAGE = "kr";
const DEFAULT_LOCATION_ID = 1842025;

class Weather extends Component {

   static contextType = LangContext;

   constructor() {
      super();
   }

   convertDegreeUnit = (c) => {
      return Math.round(((c * 9 / 5) + 32) * 100) / 100;
   };

   render() {
      console.log("Weather rendered");
      const {
         error, input, current, loading, date, degree, handleChange, handleSubmit, handleDegree,
         removeFromBookmark, addToBookmark, showBookmarkList, isWhetherMarked, showSearchList,
      } = this.props;
      console.log(current);
      const displayDegree = Object.keys(current).length > 0 ? (
         degree === 'C' ?
            (<>{current.name}, {current.main.temp}°C</>) :
            (<>{current.name}, {this.convertDegreeUnit(current.main.temp)}°F</>)
      ) : '';
      let lang = this.context;
      return (
         <>
            {Object.keys(current).length > 0 ? (
               <div className="weather">
                  <div className="form">
                     <form onSubmit={handleSubmit} autoComplete="off">
                        <span className="bookmark">{isWhetherMarked() ? (<BookmarkFill onClick={removeFromBookmark} />) : <Bookmark onClick={addToBookmark} />}</span>
                        <input placeholder="Busan" type="text" spellcheck="false" id={error.length > 0 ? 'error' : 'city'} name="city" value={input} onChange={handleChange} required autoFocus />
                        <span className="message">{error}</span>
                        {showSearchList()}
                        <div className="create-button" onClick={handleSubmit}>
                           {lang==="kr" ? "검색" : "Find"}
                        </div>
                     </form>
                  </div>
                  <div>
                     {showBookmarkList()}
                  </div>

                  <div className={weathercss.name}>
                     {displayDegree}
                     <span className="degree">
                        <button onClick={handleDegree} name="C" className={degree === 'C' ? 'activedegree' : ''}>°C</button>
                        <button onClick={handleDegree} name="F" className={degree === 'F' ? 'activedegree' : ''}>°F</button>
                     </span>
                  </div>
                  <div className={weathercss.time}>
                     {loading ? (<FontAwesomeIcon icon={faSpinner} pulse />) : (date)}
                  </div>

                  <img id="mainIcon" src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`} alt="Icon" />

                  <div className={weathercss.main}>
                     {current.weather[0].main} <FontAwesomeIcon icon={faWind} />
                     {current.wind.speed}m/s
            </div>
                  <div className={weathercss.description}>
                     {current.weather[0].description}
                  </div>

               </div>) : ''}
         </>
      )
   }
}
export default Weather;