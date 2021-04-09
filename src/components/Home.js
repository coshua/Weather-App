import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      Home
      <div className="mobile">
        <Link to="/weather">
          <button style={{ backgroundColor: "white", border: "none" }}>
            <img alt="touch this icon" src="/android-chrome-192x192.png" />
          </button>
        </Link>
        <p>Click the icon</p>
      </div>
    </>
  );
};

export default Home;
