import 'tailwindcss/tailwind.css';
import InfoBox from './InfoBox.jsx';
import React, { useRef, useState, useEffect } from 'react';
import { minutesToMs, secondsToMs, kelvinToFahrenheit, mpsTomph, convertNickname } from './util-converters.js';
import WeatherImages from './weather-images.js';

const AppMain = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [weatherCondition, setWeatherCondition] = useState('clear')
    const [weatherImage, setWeatherImage] = useState(null);
    const [todaysDate, setTodaysDate] = useState(new Date().toDateString());
    const [showInputError, setShowInputError] = useState(false);
    const locationInputRef = useRef(null); // this gets assigned when the component is rendered later down below
    const [grabbingData, setGrabbingData] = useState(false); // used to show a loading visual while the data is being fetched
    //keeping state within this component since there's no usage of this data outside of this component

    //loads local storage if any is available
    useEffect(() => {
        const storedCityName = localStorage.getItem('cityName');
        console.log("loaded stored city name: ", storedCityName)
        if (storedCityName) {
            fetchWeatherData(storedCityName);
        }
    }, [weatherData]);

    const fetchWeatherData = async (location) => {
        //only fetch if there's a location to fetch and if it's different from the current location
        if ((location.length > 0) && (!weatherData || (weatherData && location.toLowerCase() !== weatherData.   name.toLowerCase()))) {
        //sometimes users will put in a nickname for a city, this will convert it to the proper name.

            const apiKey = '8a212978a179caca3ae97c7ea69b667d'; // needs to be stored more securily .env how to store and use secret keys in a .env
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${convertNickname(location)}&appid=${apiKey}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.log(response)
                    if (response.status === 404) {
                        setShowInputError(true)
                    }
                    throw new Error('Network response was not ok');
                }
                setGrabbingData(true);
                const data = await response.json();
                setShowInputError(false);
                setWeatherData(data) //data grabbed will be stored in weatherData. this contains all of the info
                updateWeatherDisplay(data.weather[0].main); // "weather" is actually an array, usually with only one item. this grabs the first item in the array
                localStorage.setItem('cityName', data.name); // storing the city name in local storage. this will be used to fetch the data for that city/location when the page is first loaded.
                console.log('Stored City name: ', data.name);
                console.log('Weather data: ', data);

            } catch (error) {
                console.error('Fetch error: ', error);
            } finally {
                setGrabbingData(false); //always fires whether there's a response or not
                startAutoRefresh(); //starts the auto refresh after the data is fetched. in case the data is bad, it will only start if there's actually any data within the function.
            }
        }
};

    const handleLocationSearch = (input) => {
        console.log('Location search: ', input);
        clearInput(); // auto clears the input.
        fetchWeatherData(input);
    }

    const updateWeatherDisplay = (condition) => {
            condition = condition.toLowerCase();
            setWeatherCondition(condition);
            console.log('Weather condition for image use: ', condition);
            setWeatherImage(WeatherImages[condition]);
    }

    const startAutoRefresh = () => {
        if (weatherData) {
        setInterval(() => {
                fetchWeatherData(weatherData.name);
                setTodaysDate(Date().toDateString());
                // set date in case weather
                // is being checked near midnight
            }, minutesToMs(5)); // refreshes every 5 minutes
        }
    }

    const handleInputChange = () => {
        const inputValue = locationInputRef.current?.value || "";
        if (inputValue.trim() !== "") {
          setShowInputError(false); // Disable error when the user has something typed into input
        }
      };

    const clearInput = () => {
        locationInputRef.current.value = ''; // clears the input field
    }
    return (
        <div className={`flex flex-col justify-center items-center content-start round shadow-lg text-xl ${weatherCondition}`} style={{ height: "550px", width: "300px", borderRadius: "35px", color: "#292d4c"}}> {/* Added w class for width limitation */}
            <div className="p-4" style={{ width: "225px" }}>   {/* Added w class for width limitation */}
                {weatherData ? <h2 className="text-left">{`${weatherData.name}${weatherData.sys.country ? `, ${weatherData.sys.country}` : ''}`}</h2> : <h2></h2>}
                <form className='flex flex-row justify-center' onSubmit={(e) => {
                    e.preventDefault(); handleLocationSearch(e.target.elements[0].value);
                }}>
                    <input ref={locationInputRef}
                        type="text"
                        placeholder="Enter location"
                        className="text-box p-2 rounded text-white"
                        style={{ width: "200px" }}
                        onChange={handleInputChange} //writing this way prevents immediate firing of the function when it's rendered.
                        // if we needed to pass parameters, we could make a arrow function inside of onChange that lets us pass
                        // the parameters we need without on-render firing.
                        />
                    <button type='submit' className="flex-none w-30" style={{ width: "50px" }}>
                        <img src="https://via.placeholder.com/20" alt="sub" className='object-cover' />
                    </button>
                </form>
                {showInputError ? <p className="text-orange-700">Location not found!</p> : <div></div>}
                {/* <button class name="bg-red-500"onClick={() => {localStorage.removeItem('cityName')}}>Delete local data</button> */}

            </div>
            <img  src={weatherImage} alt="placeholder for Weather Visual" style={{ minHeight: "100px" }} className="mx-auto mt-4" />
            {grabbingData ?
                <div>
                    <div className='loading-anim'>Loading...</div>
                </div> : <div></div>}
            {weatherData ?
                <div>
                    <h2 className="text-center mt-4">{weatherData.weather[0].main}</h2>
                    <h1 className="text-center mt-2 text-7xl font-bold">{kelvinToFahrenheit(weatherData.main.temp)}°</h1>
                    <h4 className="text-center mt-2">{todaysDate}</h4>
                    <div className="flex flex-row justify-center space-x-4 mt-4">
                        <InfoBox title="Humidity" info={`${(weatherData.main.humidity)}%`} />
                        <InfoBox title="Wind" info={`${mpsTomph(weatherData.wind.speed)}mph`} />
                    </div>

                </div> : ''}

        </div>
    );
};

export default AppMain;