import React, { useState } from 'react';

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
    return convertDayToString(day) + ", " + date + ", " + hours;
}

const measureUVI = (uvi) => {
    var message = "";
    uvi > 11 ? message="자외선이 최고 수치입니다. 야외활동을 피하고 최대한 실내에 머무르세요." :
    uvi > 8 ? message="자외선이 아주 강합니다. 오랜 시간 야외에 머무르지 마세요." :
    uvi > 6 ? message="자외선 수치가 상당히 높습니다. 햇빛을 가리는 옷을 입고 선크림을 바르세요." :
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
    wind > 13.9 ? message="바람이 아주 강하게 불며 이는 앞으로 걷기 힘들 정도입니다." :
    wind > 10.8 ? message="나무가 흔들리는 정도로 바람이 붑니다." :
    wind > 5.5 ? message="가벼운 바람이 붑니다." :
    message = "바람이 거의 없으며 잔잔합니다.";
    return message;
}

const feelsLike = (daily) => {
    var message = `낮과 밤 동안의 체감 온도는 각각 ${daily.feels_like.day}°C, 
                    ${daily.feels_like.night}°C 입니다. 일교차는 ${Math.round((daily.temp.max- daily.temp.min) * 100)/100}
                   °C 입니다.`;
    return message;
}

const Forecast = ( props ) => {
    // const [forecast, setForecast] = useState([]);
    return(
        <div>
            {feelsLike(props.daily)} <br/>
            {measurePrecip(props.daily)} <br/>
            {convertUnixToDate(props.daily.dt)} <br/>
            {measureUVI(props.daily.uvi)} <br/>
            {measureWindspeed(props.daily.wind_speed)}
            <button onClick={() => props.history.goBack()}>Back</button>
        </div>
    );
}

export default Forecast;