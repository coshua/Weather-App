import React, { Component } from 'react';
import './App.css';
import Forecast from './components/Forecast';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>React Weather App</h1>
        </header>

        <main>
          <Forecast />


        </main>

        <footer>
          Page created by Joshua
      </footer>
      </div>
    )
  };
}

export default App;
