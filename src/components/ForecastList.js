import React, { Component } from 'react';
import Forecast from './Forecast';
import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';

class ForecastList extends Component {

    convertDayToString = (day) => {
        var result;
        day === 1 ? result = "Mon" : day === 2 ? result = "Tue" : day === 3 ? result = "Wed" :
        day === 4 ? result = "Thu" : day === 5 ? result = "Fri" : day === 6 ? result = "Sat" :
        result = "Sun";
        return result;
    }

    convertUnixToAbbr = (dt) => {
        var time = new Date(dt * 1000);
        var date = time.getDate();
        var day = time.getDay();
        return this.convertDayToString(day) + ", " + date;
    }

    render() {
        const { daily } = this.props;
        const forecastRouter = daily.map((daily, number) =>
        <>
            <NavLink to={`/${number}`}>
                <img src={`http://openweathermap.org/img/wn/${daily.weather[0].icon}@2x.png`} alt="Icon" />
            </NavLink>
            {this.convertUnixToAbbr(daily.dt)}
            </>
        );
        const forecastSwitch = daily.map((daily, number) =>
            <Route exact path={`localhost:3000/${number}`} render={({ history }) => (<Forecast daily={daily} history={history} />)} />
            // <Route path={`${this.props.match.path}/:number}`} component={Forecast} />
        );
        return (
            <div className="forecast">
                {forecastRouter}
                    {forecastSwitch}
            </div>
        )
    }
}


export default ForecastList;