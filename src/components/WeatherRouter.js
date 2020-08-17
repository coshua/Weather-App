import React, { Component } from 'react';
import city from './city';
import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import LangContext from './LangContext';
import Weather from './Weather';
import Forecast from './Forecast';
import ForecastList from './ForecastList';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;
const TIMEZONE_API = process.env.REACT_APP_TIMEZONE_API_KEY;
const DEFAULT_LOCATION_ID = 1842025;

class WeatherRouter extends Component {

    static contextType = LangContext;
    constructor() {
        super();
        this.state = {
            input: '',
            id: DEFAULT_LOCATION_ID,
            loading: true,
            current: {},
            date: '',
            error: '',
            degree: 'C',
            daily: [],
            hourly: [],
            bookmark: [],
            searchHistory: [],
        }
    };

    handleChange = (e) => {
        this.setState({
            input: e.target.value
        });
    }

    handleSubmit = (e) => {
        let lang = this.context;
        e.preventDefault(); //need to understand
        const matched = city.filter((data) => {
            return (data.name.toLowerCase() === (this.state.input.toLowerCase()));
        });

        if (matched.length > 0) {
            const { searchHistory } = this.state;
            this.setState({
                searchHistory: [{
                    id: matched[0].id,
                    name: this.state.input.toLowerCase(),
                }].concat(searchHistory),
                loading: true,
                error: '',
                input: '',
            });
            this.fetchWithId(matched[0].id);
        } else {
            let error = lang === "kr" ? "잘못 입력되었습니다." : "Invalid city";
            this.setState({ error: error });
        };
    }

    handleRemove = (id) => {
        const { searchHistory } = this.state;
        this.setState({
            searchHistory: searchHistory.filter(list => list.id !== id)
        });
    }

    handleDegree = (e) => {
        e.preventDefault();
        this.setState({
            degree: e.target.name
        });
    }

    fetchWithId = (id) => {
        let lang = this.context;
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&APPID=${WEATHER_API}&lang=${lang}`)
            .then(results => {
                return results.json();
            }).then((data) => {
                console.log(data);
                var current = JSON.parse(JSON.stringify(data));
                this.setState({
                    input: '',
                    id: id,
                    current: current,
                });
                console.log("updated " + data.name);
                return fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API}&format=json&by=position&lat=${this.state.current.coord.lat}&lng=${this.state.current.coord.lon}`);
            }).then(results => {
                return results.json();
            }).then((data) => {
                this.setState({
                    date: `${data.abbreviation}, ${data.formatted.substring(5)}`,
                    loading: false,
                });
            }).then(this.fetchForecast).catch(error => console.log("error!! ", error));
    }

    fetchForecast = () => {
        let lang = this.context;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.current.coord.lat}&lon=${this.state.current.coord.lon}&
        exclude=current,minutely&appid=${WEATHER_API}&units=metric&lang=${lang}
        `).then(results => {
            return results.json();
        }).then(data => {
            // var dailyWeather = JSON.parse(JSON.stringify(data.daily));
            this.setState({
                daily: data.daily,
                hourly: data.hourly,
            })
        })
    }

    removeFromBookmark = (e) => {
        e.preventDefault();
        const { bookmark } = this.state;
        this.setState({
            bookmark: bookmark.filter(data => data.id !== this.state.id),
        })
    }

    addToBookmark = (e) => {
        e.preventDefault();
        const { bookmark } = this.state;
        this.setState({
            bookmark: bookmark.concat({ id: this.state.id, name: this.state.current.name }),
        })
    }

    isWhetherMarked = () => {
        const { bookmark } = this.state;
        console.log(bookmark.length);
        if (bookmark.length === 0) return false;
        let filtered = bookmark.filter(data => data.id !== this.state.id);
        return filtered.length !== bookmark.length;
    }

    showBookmarkList = () => {
        let lang = this.context;
        const { bookmark } = this.state;
        const list = bookmark.map(
            (bookmark, key) => <a key={key} onClick={() => this.fetchWithId(bookmark.id)}>
                {bookmark.name}
            </a>
        );


        return (
            <div className="dropdown">
                <button className="dropbt">{lang==="kr" ? "저장된 장소" : "Bookmarked City"}</button>
                <div className="dropdown-content">
                    {list}
                </div>
            </div>
        );
    }

    showSearchList = () => {
        const { searchHistory } = this.state;
        const list = searchHistory.map(
            (history, key) =>
                <>
                    <a className="historyName"key={key} onClick={() => this.fetchWithId(history.id)}>
                        {history.name}
                    </a>
                    <a className="historyRemove" key={key} onClick={() => this.handleRemove(history.id)}>
                        x
                    </a>
                </>
        );

        return (
            <div className="history">
                {list}
            </div>
        );
    }

    componentDidMount() {
        console.log("didmount");
        try {fetch('http://localhost:5000/api')
            .then(res => res.json())
            .then(data => {
                console.log(data.city);
                this.setState({
                    id: data.city,
                });
                this.fetchWithId(this.state.id)
            })
        } finally {
            this.fetchWithId(this.state.id);
        }
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
        
        const lang = this.context;

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
                {/* <Weather handleChange={handleChange} handleSubmit={handleSubmit}
                        removeFromBookmark={removeFromBookmark} addToBookmark={addToBookmark}
                        isWhetherMarked={isWhetherMarked} showBookmarkList={showBookmarkList}
                        fetchWithId={fetchWithId}
                        current={current} id={id}
                        error={error} loading={loading} date={date} /> */}
                <Route exact path={this.props.match.path} render={() =>
                    (<Weather handleChange={handleChange} handleSubmit={handleSubmit}
                        removeFromBookmark={removeFromBookmark} addToBookmark={addToBookmark}
                        isWhetherMarked={isWhetherMarked} showBookmarkList={showBookmarkList}
                        fetchWithId={fetchWithId} handleDegree={handleDegree}
                        showSearchList={showSearchList}
                        bookmark={bookmark} degree={degree}
                        current={current} id={id} input={input} 
                        error={error} loading={loading} date={date} />)} />
                {this.state.daily.length > 0 ? (<>
                    <Route path={`${this.props.match.path}/:id`} render={({ match, history }) =>
                        (<Forecast match={match} history={history} daily={daily} city={current.name}/>)} />
                    <Route exact path={this.props.match.url} render={({ match, history }) =>
                        (<ForecastList daily={daily} match={match} history={history} />)} />
                </>) : (<FontAwesomeIcon icon={faSpinner} pulse />)}
            </>
        );
    }
}

export default WeatherRouter;