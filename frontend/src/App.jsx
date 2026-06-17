import { useState } from "react";
import axios from "axios";

const apiKey = "2474cba5fc2237143fb9d544e30a24df";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);

  const saveWeather = async (data) => {
    await axios.post("http://localhost:5000/weather/save", {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    });
  };

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      setWeather(response.data);
      await saveWeather(response.data);
    } catch (error) {
      alert("City not found!");
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          );

          setWeather(response.data);
          await saveWeather(response.data);
        } catch (error) {
          alert("Location weather fetch failed");
          console.log(error);
        }
      },
      (error) => {
        alert("Location permission denied");
        console.log(error);
      }
    );
  };

  const getForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      const dailyData = response.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(dailyData);
    } catch (error) {
      alert("Forecast not found!");
    }
  };

  const getHistory = async () => {
    const response = await axios.get("http://localhost:5000/weather/history");
    setHistory(response.data);
  };

  const deleteRecord = async (id) => {
    await axios.delete(`http://localhost:5000/weather/delete/${id}`);
    getHistory();
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1>Weather App</h1>
      <p>AI Engineer Internship Assessment</p>
      <p>Created by Geet Sehgal</p>

      <input
        type="text"
        placeholder="Enter City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "10px", margin: "10px" }}
      />

      <button
        onClick={() => {
          getWeather();
          getForecast();
        }}
        style={{ padding: "10px", margin: "5px" }}
      >
        Search
      </button>

      <button onClick={getCurrentLocation} style={{ padding: "10px", margin: "5px" }}>
        Current Location
      </button>

      <button onClick={getHistory} style={{ padding: "10px", margin: "5px" }}>
        Show History
      </button>

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>{weather.weather[0].description}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div>
          <h2>5-Day Forecast</h2>

          {forecast.map((day, index) => (
            <div key={index}>
              <p>Date: {day.dt_txt.split(" ")[0]}</p>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt="forecast icon"
              />
              <p>Temp: {day.main.temp}°C</p>
              <p>{day.weather[0].description}</p>
              <hr />
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2>Search History</h2>

          {history.map((item) => (
            <div key={item.id}>
              <p>
                {item.city} | {item.temperature}°C | {item.humidity}% |{" "}
                {item.description}
              </p>
              <button onClick={() => deleteRecord(item.id)}>Delete</button>
              <hr />
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>About PM Accelerator</h3>
        <p>
          Product Manager Accelerator is a community and learning platform that
          helps people build product, technology, and AI skills through practical
          projects and career-focused programs.
        </p>
      </div>
    </div>
  );
}

export default App;