import React, { Component } from 'react';
import axios from 'axios';

// MUI
import Divider from '@material-ui/core/Divider';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';

class Weather extends Component {
    constructor() {
        super();
        this.state = {
            forecastUrl: 'https://api.weatherbit.io/v2.0/forecast/daily',
            currentUrl: 'https://api.weatherbit.io/v2.0/current/',
            iconUrl: 'https://www.weatherbit.io/static/img/icons/',
            lat: '',
            lon: '',
            units: 'i',
            showWeather: false,
			forecast: [],
			error: ''
        }
        this.getLocation = this.getLocation.bind(this);
        this.hideWidget = this.hideWidget.bind(this);
	}
	hideWidget() {
		const { setWidgets } = this.props;
		const { bookmarks, calendar, crypto, clock, uploader, tasks } = this.props.activeWidgets;
        // Hide tasks widget
        var obj = {
            bookmarks,
            calendar,
            crypto,
            clock,
            tasks,
			weather: false,
			uploader,
        }
        setWidgets(obj);
	}
    getLocation() {
		if (navigator.geolocation) {
			this.setState({ showWeather: false });
			const options = {
				enableHighAccuracy: true
			}
			const success = (pos) => {
				this.setState({ lat: pos.coords.latitude, lon: pos.coords.longitude, showWeather: true });
				if (this.state.showWeather) {
					// Get current day
					axios.get(`${this.state.currentUrl}?lat=${this.state.lat}&lon=${this.state.lon}&key=84943a6dbebd4dfdb01b18356ee4024f&units=${this.state.units}`)
						.then((res) => res.data.data[0])
						.then(weather => {
							this.props.getWeather(weather);
						})
					// Get forecast
					axios.get(`${this.state.forecastUrl}?lat=${this.state.lat}&lon=${this.state.lon}&key=84943a6dbebd4dfdb01b18356ee4024f&units=${this.state.units}`)
						.then((res) => res.data.data)
						.then((forecast) => {
							this.props.getForecast(forecast.filter((day) => forecast.indexOf(day) <= 6));
						})
				}
			}
			const error = (err) => {
				this.setState({ error: 'Location denied, please check your settings' });
				setTimeout(() => { this.setState({  error: '' }) }, 5500);
			}
			navigator.geolocation.getCurrentPosition(success, error, options);
		} else {
			this.setState({ error: 'Allow location services for weather', showWeather: false });
			setTimeout(() => {
				this.setState({ error: '' });
			}, 3500);
		}
    }
    UNSAFE_componentWillMount() {
		this.props.getWeather({});
		this.props.getForecast([]);
	}
	UNSAFE_componentWillReceiveProps(props) {
		if (props.forecast[0] !== undefined) {
			var d = new Date();
			var day = d.getDay();
			var week = props.forecast;
			var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
			var forecast = [];
			week.forEach((dt) => {
				if (day + week.indexOf(dt) <= 6) {
					forecast.push(days[day + week.indexOf(dt)]);
				} else {
					forecast.push(days[(day + week.indexOf(dt) - 7)]);
				}
			});
			if (forecast.length > 1) {
				this.setState({ showWeather: true, forecast: forecast });
			}
		}
	}
	componentDidMount() {
		this.getLocation();
	}
    render() {
		const { forecast, weather } = this.props;
        return (
            <div style={{maxHeight: `${forecast[0] === undefined ? '125px' : '275px'}`}} id="weather" className="widget">
                <div className="delete-widget" onClick={this.hideWidget}><Close /></div>
                {this.state.showWeather === true && forecast[0] !== undefined ? 
                    <div className="results">
                        <div className="temp">
                            <div className="temp-current">
                                {weather.temp} {this.state.unit === 'i' ? <span>&#8451;</span> : <span>&#8457;</span>}
                            </div>
                            <div className="temp-other">
                                <p>HI: <span>{forecast[0].max_temp.toString().split('.')[0]}</span></p>
                                <p>LO: <span>{forecast[0].min_temp.toString().split('.')[0]}</span></p>
                            </div>
                        </div>
                        <p className="location">
                            <span>{weather.city_name}, {weather.state_code}</span>
                        </p>
                        <Divider />
                        <div className="week">
                            {forecast.filter((d => forecast.indexOf(d) > 0)).map((day, i) => {
                                return (
                                    <div key={i} className="day">
                                        <span>{this.state.forecast[forecast.indexOf(day) -1]}</span>
                                        <img src={`${this.state.iconUrl}${forecast[i].weather.icon}.png`} alt={forecast[i].weather.description} />
                                        <span>{forecast[i].app_max_temp.toString().split('.')[0]}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                : 
                <div>
                    <h1>Weather</h1>
                    <Button onClick={this.getLocation} variant="contained" color="primary">
                        Allow Location Services
                    </Button>
                </div>}
				{/* Error Snackbar */}
				<Snackbar className="fixed-snackbar"
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					open={this.state.error.length > 0 ? true : false}
				>
					<SnackbarContent className="sn-bar error-snackbar"
						aria-describedby="error-snackbar"
						message={
							<span>
								{this.state.error}
								<ErrorIcon />
							</span>
						}
					/>
				</Snackbar>
            </div>
        )
    }
}

export default Weather;