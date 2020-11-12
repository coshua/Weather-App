import React from "react";
import Profile from "./dongju.jpg";

const About = (props) => {
  return (
    <div className="container-flex justify-content-center   ">
      <div className="About-section">
        <h2>About Us</h2>
        Plan your schedule with our weather app
      </div>

      <div
        className="card justify-content-center"
        style={{ width: "150px", alignItems: "center" }}
      >
        <img
          className="card-img-bottom img-fluid mx-auto"
          src={Profile}
          alt="Dongju Kim"
        />
        <div className="card-body">
          <h4 className="card-title">Dongju Kim</h4>
          <p className="card-text">Dongju Kim is a software engineer.</p>
          <a href="https://github.com/coshua">Visit Github</a>
        </div>
      </div>
    </div>
  );
};

export default About;
