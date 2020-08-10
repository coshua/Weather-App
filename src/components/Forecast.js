import React, { useState } from 'react';
import { NavLink, matchPath } from 'react-router-dom';
import './Forecast.css';

const convertDayToString = (day) => {
    var result;
    day === 1 ? result = "Mon" : day === 2 ? result = "Tue" : day === 3 ? result = "Wed" :
        day === 4 ? result = "Thu" : day === 5 ? result = "Fri" : day === 6 ? result = "Sat" :
            result = "Sun";
    return result;
}

const convertUnixToDate = (dt) => {
    var time = new Date(dt * 1000);
    var date = time.getDate();
    var hours = time.getHours();
    var day = time.getDay();
    return convertDayToString(day) + ", " + date;
}

const measureUVI = (uvi) => {
    var message = "";
    uvi > 11 ? message = "자외선이 최고 수치입니다. 야외활동을 피하고 최대한 실내에 머무르세요." :
        uvi > 8 ? message = "자외선이 아주 강합니다. 오랜 시간 야외에 머무르지 마세요." :
            uvi > 6 ? message = "자외선 수치가 상당히 높습니다. 햇빛을 가리는 옷을 입고 선크림을 바르세요." :
                message = "";
    return message;
}

const measurePrecip = (daily) => {
    var message = "";
    if (daily.rain !== undefined)
        message += `비가 올 예정입니다. 강수량은 시간당 ${daily.rain}mm 입니다.`
    if (daily.snow !== undefined)
        message += `눈이 올 예정입니다. 강설량은 시간당 ${daily.snow}mm 입니다.`
    return message;
}

const measureWindspeed = (wind) => {
    var message = "";
    wind > 13.9 ? message = "바람이 아주 강하게 불며 이는 앞으로 걷기 힘들 정도입니다." :
        wind > 10.8 ? message = "나무가 흔들리는 정도로 바람이 붑니다." :
            wind > 5.5 ? message = "가벼운 바람이 붑니다." :
                message = "바람이 거의 없으며 잔잔합니다.";
    return message;
}

const feelsLike = (daily) => {
    var message = `낮과 밤 동안의 체감 온도는 각각 ${Math.round(daily.feels_like.day * 10) / 10}°C, 
                ${Math.round(daily.feels_like.night * 10) / 10}°C 입니다. 일교차는 ${Math.round((daily.temp.max - daily.temp.min) * 10) / 10}
                °C 입니다.`;
    return message;
}

const findDate = (dt) => {
    var time = new Date(dt * 1000);
    return time.getDate();
}

const findMonth = (dt) => {
    var time = new Date(dt * 1000);
    return time.getMonth();
}

const Forecast = ({ match, history, daily, city }) => {
    // const specific = daily[match.params.id];
    const day = daily.filter(daily =>
        findDate(daily.dt) + "" === match.params.id
    );
    const specific = day[0];

    const calculateDay = (num) => {
        var num = parseInt(num);
        var month = findMonth(specific.dt) + 1;
        if (month == 1 || 3 || 5 || 7 || 8 || 10 || 12) {
            if (parseInt(match.params.id) + num > 31) {
                return parseInt(match.params.id) + num - 31;
            } else {
                return parseInt(match.params.id) + num;
            }
        } else if (month == 4 || 6 || 9 || 11) {
            if (parseInt(match.params.id) + num > 30) {
                return parseInt(match.params.id) + num - 30;
            } else {
                return parseInt(match.params.id) + num;
            }
        }
    };
    // const [forecast, setForecast] = useState([]);
    return (
        <div>
            <img src={`http://openweathermap.org/img/wn/${specific.weather[0].icon}@2x.png`} alt="Icon" /> <br />
            {`Weather of ${city}, ${convertUnixToDate(specific.dt)}`} <br />
            {feelsLike(specific)} <br />
            {measurePrecip(specific).length > 0 ? (<>{measurePrecip(specific)} <br /></>) : ('')}
            {measureUVI(specific.uvi)} <br />
            {measureWindspeed(specific.wind_speed)} <br />
            <div className="buttonGroup">
                {specific.dt !== daily[0].dt ?
                    (<NavLink to={`/weather/${calculateDay(-1)}`} > <button id="previous">Previous</button></NavLink>)
                    : ('')}
                {/* <button onClick={() => history.goBack()}>Home</button> */}
                <NavLink to={'/weather'}> <button className="center">Home</button> </NavLink>
                {specific.dt !== daily[7].dt ?
                    (<NavLink to={`/weather/${calculateDay(1)}`} > <button id="next">Next</button> </NavLink>)
                    : ('')}
            </div>
        </div>
    );
}

export default Forecast;