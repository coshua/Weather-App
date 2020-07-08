import React, { Component } from 'react';
import './App.css';
import Weather from './components/Weather';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>React Weather App</h1>
        </header>

        <main>
          <Weather />


        </main>

        <footer>
          Page created by Joshua
      </footer>
      </div>
    )
  };
}

export default App;
