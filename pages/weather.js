import { Component } from 'react';
import {
    VictoryLine,
    VictoryChart,
    VictoryTheme,
    VictoryAxis,
    VictoryVoronoiContainer,
    VictoryTooltip
} from "victory";

class Weather extends Component {
    state = {
        hourlyLink: null,
        hourlyForecast: null,
        temperatureParsed: [],
        windSpeedParsed: [],
    };

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.error('Error Getting Weather Conditions: ', error);
            }
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.hourlyLink !== this.state.hourlyLink) {
            this.fetchhourlyForecast(this.state.hourlyLink);
        }
    }

    fetchWeather(lat = 25, lon = 25) {
        fetch(
            `https://api.weather.gov/points/${lat},${lon}`
        )
            .then(res => res.json())
            .then(json => {
                this.setState({
                    hourlyLink: json.properties.forecastHourly
                });
            });
    }

    fetchhourlyForecast(link) {
        fetch(link)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    hourlyForecast: json.properties.periods,
                    hourlyWindDirection: json.properties.periods.windDirection
                }, () => this.parseHourlyForecast());
            });
    }

    parseHourlyForecast() {
        const { hourlyForecast } = this.state;
        let tempArr = [];
        let windArr = [];
        hourlyForecast && hourlyForecast.slice(0, 24).map(d => tempArr.push({x: d.startTime, y: d.temperature}))
            && hourlyForecast.slice(0, 24).map(d => windArr.push({x: d.startTime, y: parseInt(d.windSpeed), z: d.windDirection}));
        this.setState({
            temperatureParsed: tempArr,
            windSpeedParsed: windArr
        })
    }

    render() {
        const { temperatureParsed, windSpeedParsed } = this.state;

        return (
            <div style={{
                paddingTop: 40,
                paddingLeft: 25,
                textAlign: 'center'
            }}>
                <p>Today's Temperature and Wind Forecast Hour-by-Hour</p>
                { temperatureParsed.length && windSpeedParsed.length ? (
                    <VictoryChart
                        theme={VictoryTheme.material}
                        scale={{ x: "time" }}
                        containerComponent={<VictoryVoronoiContainer/>}
                        padding={{left: 30, top: 20, right: 50, bottom: 80}}
                        minDomain={{ y: 0 }}
                        height={200}
                        animate={{
                            duration: 2000,
                            onLoad: { duration: 500 }
                          }}
                    >
                        {/* temperature line */}
                        <VictoryLine
                            style={{
                                data: { stroke: "#c43a31" },
                                parent: { border: "1px solid #ccc"}
                            }}
                            data={temperatureParsed}
                            labels={(d) => `${d.y}°F`}
                            labelComponent={
                                <VictoryTooltip
                                    style={{ fontSize: 10 }}
                                />
                            }
                        />
                        {/* wind line */}
                        <VictoryLine
                            style={{
                                data: { stroke: "#d3d3d3" },
                                parent: { border: "1px solid #ccc"}
                            }}
                            data={windSpeedParsed}
                            labels={(d) => `${d.y}mph from ${d.z}`}
                            labelComponent={
                                <VictoryTooltip
                                    style={{ fontSize: 10 }}
                                />
                            }
                        />
                        {/* x-axis */}
                        <VictoryAxis
                            tickFormat={(t) => {
                                const timeIndex = t.indexOf('T') + 1;
                                return t.slice(timeIndex, timeIndex + 2);
                            }}
                            label="Hour of Day"
                            tickCount={12}
                            style={{axisLabel: {padding: 40}}}
                        />
                        {/* y-axis */}
                        <VictoryAxis
                            dependentAxis
                            tickCount={9}
                            style={{axisLabel: {padding: 50}}}
                        />
                    </VictoryChart>
                ) : <div>Loading...</div> }
            </div>
        );
    }
}

export default Weather;
