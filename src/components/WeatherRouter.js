import React, { Component } from 'react';
import city from './city';
import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Weather from './Weather';
import ForecastList from './ForecastList';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WEATHER_API = process.env.REACT_APP_WEATHER_API_KEY;
const TIMEZONE_API = process.env.REACT_APP_TIMEZONE_API_KEY;
const LANGUAGE = "kr";
const DEFAULT_LOCATION_ID = 1842025;

class WeatherRouter extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            id: DEFAULT_LOCATION_ID,
            loading: true,
            current: {},
            date: '',
            error: '',
            daily: [],
            hourly: [],
            bookmark: [],
        }
    };

    handleChange = (e) => {
        this.setState({
            input: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault(); //need to understand
        const matched = city.filter((data) => {
            return (data.name.toLowerCase() === (this.state.input.toLowerCase()));
        });

        if (matched.length > 0) {
            this.setState({
                loading: true,
                error: '',
            });
            this.fetchWithId(matched[0].id);
        } else {
            this.setState({ error: 'Invalid city' });
        };
    }

    fetchWithId = (id) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&APPID=${WEATHER_API}&lang=${LANGUAGE}`)
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
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.current.coord.lat}&lon=${this.state.current.coord.lon}&
        exclude=current,minutely&appid=${WEATHER_API}&units=metric&lang=${LANGUAGE}
        `).then(results => {
            return results.json();
        }).then(data => {
            // var dailyWeather = JSON.parse(JSON.stringify(data.daily));
            this.setState({
                daily: data.daily,
                hourly: data.hourly,
            })
            console.log(data);
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
        const { bookmark } = this.state;
        const list = bookmark.map(
            (bookmark, key) => <a key={key} onClick={() => this.fetchWithId(bookmark.id)}>
                {bookmark.name}
            </a>
        );


        return (
            <div className="dropdown">
                <button className="dropbt">Bookmarked City</button>
                <div className="dropdown-content">
                    {list}
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log("didmount")
        this.fetchWithId(this.state.id);
    }


    render() {
        const {
            handleChange,
            handleSubmit,
            removeFromBookmark,
            addToBookmark,
            isWhetherMarked,
            showBookmarkList,
            fetchWithId,
        } = this;

        const {
            loading,
            error,
            date,
            current,
            id,
            bookmark,
            daily
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
                        fetchWithId={fetchWithId} bookmark={bookmark}
                        current={current} id={id}
                        error={error} loading={loading} date={date} />)} />
                {this.state.daily.length > 0 ? (<ForecastList daily={daily}/>) : (<FontAwesomeIcon icon={faSpinner} pulse />)}
            </>
        );
    }
}

export default WeatherRouter;