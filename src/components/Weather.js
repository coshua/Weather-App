import React, { Component } from "react";
import weathercss from "./Weather.module.css";
import "./Weather.css";
// import Forecast from './Forecast';
import city from './city';
// import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWind, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { BookmarkFill, Bookmark } from "react-bootstrap-icons";
import LangContext from "./LangContext";

class Weather extends Component {
  static contextType = LangContext;
  constructor() {
    super();
    this.state = {
      input: "",
      error: "",
      degree: "C",
      bookmark: [],
      searchHistory: [],
    };
  }

  convertDegreeUnit = (c) => {
    return Math.round(((c * 9) / 5 + 32) * 100) / 100;
  };
  
  handleChange = (e) => {
    this.setState({
      input: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let lang = this.context;
    //e.preventDefault();
    const matched = city.filter((data) => {
      return data.name.toLowerCase() === this.state.input.toLowerCase();
    });

    if (matched.length > 0) {
      const { searchHistory } = this.state;
      this.props.handleLoading();
      this.setState({
        searchHistory: [
          {
            id: matched[0].id,
            name: this.state.input.toLowerCase(),
          },
        ].concat(searchHistory),
        error: "",
        input: "",
      });
      this.props.fetchWithId(matched[0].id);
    } else {
      let error = lang === "kr" ? "잘못 입력되었습니다." : "Invalid city";
      this.setState({ error: error });
    }
  };

  handleRemove = (id) => {
    const { searchHistory } = this.state;
    this.setState({
      searchHistory: searchHistory.filter((list) => list.id !== id),
    });
  };

  handleDegree = (e) => {
    e.preventDefault();
    this.setState({
      degree: e.target.name,
    });
  };

  removeFromBookmark = (e) => {
    e.preventDefault();
    const { bookmark } = this.state;
    this.setState({
      bookmark: bookmark.filter((data) => data.id !== this.props.id),
    });
  };

  addToBookmark = (e) => {
    e.preventDefault();
    const { bookmark } = this.state;
    this.setState({
      bookmark: bookmark.concat({
        id: this.props.id,
        name: this.props.current.name,
      }),
    });
  };

  isWhetherMarked = () => {
    const { bookmark } = this.state;
    if (bookmark.length === 0) return false;
    let filtered = bookmark.filter((data) => data.id !== this.props.id);
    return filtered.length !== bookmark.length;
  };

  showBookmarkList = () => {
    let lang = this.context;
    const { bookmark } = this.state;
    const list = bookmark.map((bookmark, key) => (
      <span className="dropdown-span" key={key} onClick={() => this.props.fetchWithId(bookmark.id)}>
        {bookmark.name}
      </span>
    ));

    return (
      <div className="dropdown">
        <button className="dropbt">
          {lang === "kr" ? "저장된 장소" : "Bookmarked City"}
        </button>
        <div className="dropdown-content">{list}</div>
      </div>
    );
  };

  showSearchList = () => {
    const { searchHistory } = this.state;
    const list = searchHistory.map((history, key) => (
      <>
        <span
          className="historyName"
          key={key}
          onClick={() => this.props.fetchWithId(history.id)}
        >
          {history.name}
        </span>
        <span
          className="historyRemove"
          onClick={() => this.props.handleRemove(history.id)}
        >
          x
        </span>
      </>
    ));

    return <div className="history">{list}</div>;
  };

  render() {
    const {
      current,
      date,
      loading
    } = this.props;
    const {
      error,
      input,
      degree
    } = this.state;
    const displayDegree =
      Object.keys(current).length > 0 ? (
        degree === "C" ? (
          <>
            {current.name}, {current.main.temp}°C
          </>
        ) : (
          <>
            {current.name}, {this.convertDegreeUnit(current.main.temp)}°F
          </>
        )
      ) : (
        ""
      );
    let lang = this.context;
    return (
      <>
        {Object.keys(current).length > 0 ? (
          <div className="weather">
            <div className="form">
              <form onSubmit={this.handleSubmit} autoComplete="off">
                <span className="bookmark">
                  {this.isWhetherMarked() ? (
                    <BookmarkFill onClick={this.removeFromBookmark} />
                  ) : (
                    <Bookmark onClick={this.addToBookmark} />
                  )}
                </span>
                <input
                  placeholder="Irvine"
                  type="text"
                  spellCheck="false"
                  id={error.length > 0 ? "error" : "city"}
                  name="city"
                  value={input}
                  onChange={this.handleChange}
                  required
                  autoFocus
                />
                <span className="message">{error}</span>
                {this.showSearchList()}
                <span className="create-button" onClick={this.handleSubmit}>
                  {lang === "kr" ? "검색" : "Find"}
                </span>
              </form>
            </div>
            <div>{this.showBookmarkList()}</div>

            <div className={weathercss.name}>
              {displayDegree}
              <span className="degree">
                <button
                  onClick={this.handleDegree}
                  name="C"
                  className={degree === "C" ? "activedegree" : ""}
                >
                  °C
                </button>
                <button
                  onClick={this.handleDegree}
                  name="F"
                  className={degree === "F" ? "activedegree" : ""}
                >
                  °F
                </button>
              </span>
            </div>
            <div className={weathercss.time}>
              {loading ? <FontAwesomeIcon icon={faSpinner} pulse /> : date}
              {/* {loading ? (<div className="spinner-border spinner-border-sm text-info"></div>) : (date)} */}
            </div>
            <div className={weathercss.icon}>
            <img
              id="mainIcon"
              src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
              alt="Icon"
            />
          </div>
            <div className={weathercss.main}>
              {current.weather[0].main} <FontAwesomeIcon icon={faWind} />
              {current.wind.speed}m/s
            </div>
            <div className={weathercss.description}>
              {current.weather[0].description}
            </div>
         
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
}
export default Weather;
