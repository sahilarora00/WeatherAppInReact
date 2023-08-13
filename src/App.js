import React from 'react';
import './App.css';
import { PoweroffOutlined, CheckCircleOutlined ,AntCloudOutlined,EnvironmentOutlined} from '@ant-design/icons';

let weatherInfoElement;
function App() {
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  const [SerchValue, setSerchValue] = React.useState('');
  const [RelativeSaerchData, setRelativeSaerchData] = React.useState([]);
  const [darkTheme, setDarkTheme] = React.useState(false);

  // this Function for fetch weather data 

  async function fetchWeatherData(cityName) {
    //   let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e515bf7d7d09452d5f9526b3880658aa`;

    let NewName = removeDistrictWord(cityName)

    let apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${NewName}&type=like&appid=e515bf7d7d09452d5f9526b3880658aa&cnt=50&offset=0`;
    try {
      let response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Weather data not available for the specified city.');
      }
      let data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Unable to fetch weather data. Please try again later.');
    }
  };

  // this funtion for remove district word

  function removeDistrictWord(districtName) {
    const districtKeyword = "district";
    const trimmedDistrictName = districtName.trim();

    if (trimmedDistrictName.toLowerCase().endsWith(districtKeyword)) {
      const withoutDistrict = trimmedDistrictName.slice(0, -districtKeyword.length).trim();
      return withoutDistrict;
    }

    return trimmedDistrictName;
  }



  /// This function for OnClick button

  async function GetWeatherOnclickFuc() {
    if(document.getElementById('suggestionDiv') != null && document.getElementById('suggestionDiv') != undefined && document.getElementById('suggestionDiv') != ''){
      document.getElementById('suggestionDiv').style.display = 'none'
      const elements = document.getElementsByClassName('Imput-And-Suggestions-Div');
  
      for (const element of elements) {
        element.style.boxShadow = '';
      }
    }
    let cityName = document.getElementById('searchInput').value.trim();

    if (cityName !== '') {
      try {
        let weatherData = await fetchWeatherData(cityName);
        displayWeatherData(weatherData);
      } catch (error) {
        displayErrorMessage(error.message);
      }
    } else {
      displayErrorMessage('Please enter a valid city name.');
    }
  }


  /// This function for display data 

  function displayWeatherData(data) {
    let weatherInfoElement = document.getElementById('weatherInfo');
    let weatherInfoHTML = '';

    for (let i = 0; i < data?.list.length; i++) {
      console.log(data?.list[i])
      let weatherIcon = getWeatherIconURL(data?.list[i]?.weather[0]?.icon);
      let weatherDescription = data?.list[i]?.weather[0].description;

      weatherInfoHTML += `
        <div class="weather-icon">
          <img src="${weatherIcon}">
        </div>
        <div class="weather-description">
          <h3>Weather for ${data?.list[i]?.name}, ${data?.list[i]?.sys?.country}</h3>
          <p>Temperature: ${data?.list[i]?.main?.temp} °C</p>
          <p>Weather: ${weatherDescription}</p>
          <p>Humidity: ${data?.list[i]?.main?.humidity}%</p>
        </div>
        <hr style="border-color: #ccc; border-width: 0; margin: 10px 0;">
      `;
    }

    weatherInfoElement.innerHTML = weatherInfoHTML;
  }

  function getWeatherIconURL(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  }


  function displayErrorMessage(message) {
    weatherInfoElement = document.getElementById('weatherInfo');
    weatherInfoElement.innerHTML = `<p class="error">${message}</p>`;
  };

  async function SearchSuggestion(event) {
    try {
      const elements = document.getElementsByClassName('Imput-And-Suggestions-Div');

      const boxShadowValue = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';

      for (const element of elements) {
        element.style.boxShadow = boxShadowValue;
      }
      const searchValue = event.target.value;
      setSerchValue(searchValue);

      const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions?namePrefix=${searchValue}&limit=10`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'd4e5fa56bcmsh51f9af08d7b500ap105336jsn6a63035e3412',
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to fetch data from the API.');
      }

      const result = await response.json();
      console.log(result);
      setRelativeSaerchData(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  function SuggestionData(Value) {
    setSerchValue(Value.target.innerHTML);
    GetWeatherOnclickFuc();
  };

  function ThemeChangeButton() {
    setDarkTheme(prevTheme => !prevTheme);
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const divs = document.querySelectorAll('.Imput-And-Suggestions-Div');
      if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
      } else {
        body.setAttribute('data-theme', 'dark');
      }

  }

  function FetchCurentLoction() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;

          fetch(url)
            .then(response => response.json())
            .then(data => {
              if (data.address && data.address.county) {
                console.log('Current District:', data.address.state_district);
                setSerchValue( data.address.state_district);
              } else {
                console.log('District information not found.');
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        },
        function (error) {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }

  }



  return (
    <>
    <body>
    <div className="container">
      <div className="theme-toggle">
        <button
          id="themeToggle"
          onClick={ThemeChangeButton}
          title={darkTheme ? 'Switch to Light theme' : 'Switch to Dark theme'}
        >
          {darkTheme ? <PoweroffOutlined /> : <CheckCircleOutlined />}
        </button>
      </div>
      <h1 title="Weather App">Weather App</h1>
      <div className="Imput-And-Suggestions-Div">
        <div className="input-container">
          <input
            name="fname"
            className="suggestions"
            value={SerchValue}
            onChange={SearchSuggestion}
            type="text"
            id="searchInput"
            placeholder="Enter city name"
          />
          <button
            id="locationButton"
            onClick={FetchCurentLoction}
            title="Get Current Location"
          >
            <EnvironmentOutlined />
          </button>
        </div>
        {SerchValue.length > 0 && RelativeSaerchData ? (
          RelativeSaerchData?.map((item) => {
            return (
              <div
                id="suggestionDiv"
                onClick={SuggestionData}
                className="suggestions"
              >
                {item.name}
              </div>
            );
          })
        ) : null}
      </div>
      <button
        title={'Get Weather'}
        id="fetchButton"
        onClick={GetWeatherOnclickFuc}
      >
        Get Weather
        <AntCloudOutlined />
      </button>
      <div id="weatherInfo"></div>
    </div>
  </body>;
  
    </>
  );
}

export default App;
