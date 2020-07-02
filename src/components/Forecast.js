import React, { Component } from 'react';
import './Forecast.css';
import city from './city';

class Forecast extends Component {

   constructor() {
      super();
      this.state = {
         input: '',
         id: '1835847',
         weather: {
            name: '',
            main: '',
            description: '',
            temp: '',
            feels_like: ''
         },
         icon: '01d',
         date: new Date(),
      };
   }

   handleChange = (e) => {
      this.setState({
         input: e.target.value
      });
   }

   fetchWithId = (id) => {
      fetch(`http://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&APPID=30742e5b36b25c75ceb4b039caaf558f`)
         .then(results => {
            return results.json();
         }).then((data) => {
            this.setState({
               input: '', 
               id: id, 
               weather: {  
                  name: data.name,
                  main: data.weather[0].main, 
                  description: data.weather[0].description,
                  temp: data.main.temp, 
                  feels_like: data.main.feels_like
               },
               icon: data.weather[0].icon,
               date: new Date()
            });
            console.log("updated " + data.name);
         });
   }

   handleSubmit = () => {
      const matched = city.filter((data) => {
         return (data.name.toLowerCase()===(this.state.input.toLowerCase()));
      });

      if (matched.length > 0) this.fetchWithId(matched[0].id);
   }

   handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         this.handleSubmit();
      }
   }

   componentDidMount() {
      this.fetchWithId(this.state.id);
   }

   render() {
      const {
         handleChange,
         handleSubmit,
         handleKeyPress
      } = this;
      return (
         <div className="weather">
            <div className="form">
               <form>
                  <input type="text" id="city" name="city" onKeyPress={handleKeyPress} value={this.state.input} onChange={handleChange} />
                  <div className="create-button" onClick={handleSubmit}>
                     Find
                  </div>
               </form>
            </div>
            <div className="name temp">
            {this.state.weather.name}, {this.state.weather.temp}°C
            </div>
            <div className="time">
               {this.state.date.toLocaleTimeString()}
            </div>
            <img src={`http://openweathermap.org/img/wn/${this.state.icon}@2x.png`} alt="Icon" />
            <div className="main">
               {this.state.weather.main}
            </div>
            <div clasName="description">
               {this.state.weather.description}
            </div>
         </div>
      )
   }
}
export default Forecast;