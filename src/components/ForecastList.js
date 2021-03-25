import React, { Component } from "react";
import "./ForecastList.css";
import { Link } from "react-router-dom";

class ForecastList extends Component {
  convertDayToString = (day) => {
    var result;
    day === 1
      ? (result = "Mon")
      : day === 2
      ? (result = "Tue")
      : day === 3
      ? (result = "Wed")
      : day === 4
      ? (result = "Thu")
      : day === 5
      ? (result = "Fri")
      : day === 6
      ? (result = "Sat")
      : (result = "Sun");
    return result;
  };

  convertUnixToAbbr = (dt) => {
    var time = new Date(dt * 1000);
    var date = time.getDate();
    var day = time.getDay();
    return this.convertDayToString(day) + ", " + date;
  };

  convertUnixToDate = (dt) => {
    var time = new Date(dt * 1000);
    return time.getDate();
  };

  render() {
    const { daily, gmtOffset, match } = this.props;
    const forecastRouter = daily.map((daily, index) => (
      <div className={`items item${index}`} key={index}>
        <Link to={`${match.url}/${this.convertUnixToDate(daily.dt + gmtOffset)}`}>
          <img
            src={`https://openweathermap.org/img/wn/${daily.weather[0].icon}@2x.png`}
            alt="Icon"
          />
        </Link>
        <br/>
        <span className="caption">
          {this.convertUnixToAbbr(daily.dt + gmtOffset)}
          <br />
          {Math.round(daily.temp.max)}, {Math.round(daily.temp.min)}
        </span>
      </div>
    ));
    return <div className="forecast">{forecastRouter}</div>;
  }
}

export default ForecastList;
