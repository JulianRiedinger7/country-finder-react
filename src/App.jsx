import "./styles.css";
import React, { useState, useEffect } from "react";

export default function App() {
  const API_KEY = "ac93b12671a21823a2c4daf016b98e3b";

  const [countryData, setCountryData] = useState([]);
  const [inputCountry, setInputCountry] = useState("");
  const [weather, setWeather] = useState({});

  console.log(inputCountry);

  function handleChange(evt) {
    setInputCountry(evt.target.value);
  }

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/name/${inputCountry}`)
      .then((res) => res.json())
      .then((data) => setCountryData(data))
      .catch((err) => console.log(err));
  }, [inputCountry]);

  useEffect(() => {
    if (countryData.length === 1) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${countryData[0].capital}&appid=${API_KEY}&units=metric`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setWeather(data);
        })
        .catch((err) => console.log(err));
    }
  }, [countryData]);
  console.warn(weather.main);

  function showInfo(country) {
    return (
      <div key={country.name.official}>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
        <h4>languages</h4>
        <ul>
          {Object.entries(country.languages).map((lang) => (
            <li key={lang[0]}>{lang[1]}</li>
          ))}
        </ul>
        <img src={country.flags.svg} alt="flag" />
        <h2>Weather in {country.capital[0]}</h2>
        <p>temperature {weather.main?.temp} celsius</p>
        <p>wind {weather.wind?.speed} m/s</p>
      </div>
    );
  }
  return (
    <div>
      <label htmlFor="country">find countries</label>
      <input
        type="text"
        id="country"
        onChange={handleChange}
        value={inputCountry}
      />
      {countryData.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}
      {countryData.length > 1 &&
        countryData.length <= 10 &&
        countryData.map((country) => (
          <div key={country.name.official}>
            <p>{country.name.common}</p>
            <button
              value={country.name.common}
              onClick={(e) => setInputCountry(e.target.value)}
            >
              Show
            </button>
          </div>
        ))}
      {countryData.length === 1 &&
        countryData.map((country) => showInfo(country))}
    </div>
  );
}
