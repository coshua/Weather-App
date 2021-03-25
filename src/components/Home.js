import React from "react";
import './Home.css';
import { Link } from 'react-router-dom'

const Home = () => {
  return <>
   Home 
  <div className="mobile">
    <Link to="/weather">
      <button>Click</button>
    </Link>
  </div>
  </>;
};

export default Home;
