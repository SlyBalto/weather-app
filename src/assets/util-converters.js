import nicknames from './nicknames.js';

const minutesToMs = (minutes) => minutes * 60 * 1000; // shorter name keeps things a bit cleaner

const secondsToMs = (seconds) => seconds * 1000; // shorter name keeps things a bit cleaner

const kelvinToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * 9/5 + 32).toFixed(0); // removes decimal
}; // temperature data comes in Kelvin, so this function converts it to Fahrenheit

const mpsTomph = (mps) => (mps * 2.23694).toFixed(1); // shorter name keeps things a bit cleaner

const convertNickname = (input) => {
    return nicknames[input.toLowerCase()] || input;
    // uses the nicknames.js file to convert common shorthand
    // and abbreviated city names to proper city names used by the API
};

export { minutesToMs, secondsToMs, kelvinToFahrenheit, mpsTomph, convertNickname };