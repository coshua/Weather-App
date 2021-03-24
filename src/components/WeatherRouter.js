import React, { Component } from "react";
import city from "./city";
import { Route, Switch } from "react-router-dom";
import LangContext from "./LangContext";
import Weather from "./Weather";
import Forecast from "./Forecast";
import Home from './Home';
import ForecastList from "./ForecastList";

class WeatherRouter extends Component {
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

 

  render() {
    const {
      handleChange,
      handleSubmit,
      removeFromBookmark,
      addToBookmark,
      isWhetherMarked,
      showBookmarkList,
      showSearchList,
      fetchWithId,
      handleDegree,
    } = this;
    console.log(this.props.match);
    // const lang = this.context;

    const {
      loading,
      error,
      date,
      current,
      id,
      input,
      degree,
      bookmark,
      daily,
    } = this.state;

    return (
      <>
        <Switch>
          {/* <Weather handleChange={handleChange} handleSubmit={handleSubmit}
                        removeFromBookmark={removeFromBookmark} addToBookmark={addToBookmark}
                        isWhetherMarked={isWhetherMarked} showBookmarkList={showBookmarkList}
                        fetchWithId={fetchWithId}
                        current={current} id={id}
                        error={error} loading={loading} date={date} /> */}
          <Route
            exact
            path='/weather'
            render={({ match, history }) => (
              <>
                <Weather
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  removeFromBookmark={removeFromBookmark}
                  addToBookmark={addToBookmark}
                  isWhetherMarked={isWhetherMarked}
                  showBookmarkList={showBookmarkList}
                  fetchWithId={fetchWithId}
                  handleDegree={handleDegree}
                  showSearchList={showSearchList}
                  bookmark={bookmark}
                  degree={degree}
                  current={current}
                  id={id}
                  input={input}
                  error={error}
                  loading={loading}
                  date={date}
                />
                <ForecastList daily={daily} match={match} history={history} />
                
              </>
            )}
          />
          <Route
            path="/test"
            component={Home}
          />
          <Route
            exact path="weather/:id"
            render={() => (
              <Forecast
                daily={daily}
                city={current.name}
              />
            )}
          />
        </Switch>
      </>
    );
  }
}

export default WeatherRouter;
