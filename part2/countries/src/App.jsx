import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (!capital || !api_key) return

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
    
    axios
      .get(weatherUrl)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Error fetching weather data:', error)
      })
  }, [capital, api_key])

  if (!weather) {
    return null
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  const languages = Object.values(country.languages || {})
  const capital = country.capital ? country.capital[0] : null

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul style={{ display: 'inline-block', textAlign: 'left', margin: '0 auto 15px auto' }}>
        {languages.map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>

      <div>
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          width="150"
        />
      </div>

      {capital && <Weather capital={capital} />}
    </div>
  )
}

const App = () => {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setSelectedCountry(null) 
  }

  const filteredCountries = query === ''
    ? []
    : allCountries.filter(c =>
        c.name.common.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleQueryChange} />
      </div>

      <div>
        {selectedCountry ? (
          <CountryDetail country={selectedCountry} />
        ) : filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length > 1 ? (
          filteredCountries.map(country => (
            <div key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setSelectedCountry(country)}>show</button>
            </div>
          ))
        ) : filteredCountries.length === 1 ? (
          <CountryDetail country={filteredCountries[0]} />
        ) : query !== '' ? (
          <p>No matches found</p>
        ) : null}
      </div>
    </div>
  )
}

export default App